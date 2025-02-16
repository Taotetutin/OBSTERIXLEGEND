import { patients, calculations, users, type Calculation, type InsertCalculation, type Patient, type InsertPatient, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, between } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { ctgData, type CtgData, type InsertCtgData } from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;

  // Session store
  sessionStore: session.Store;

  // Existing methods
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getCalculationById(id: number): Promise<Calculation | undefined>;
  getCalculationsByType(type: string): Promise<Calculation[]>;
  savePatient(patient: InsertPatient): Promise<Patient>;
  getPatientById(id: number): Promise<Patient | undefined>;
  getAllPatients(): Promise<Patient[]>;
  getCalculationHistory(patientId?: number, type?: string, limit?: number): Promise<Calculation[]>;
  getCalculationsForComparison(comparisonGroup: string): Promise<Calculation[]>;
  updateCalculationNotes(id: number, notes: string): Promise<Calculation>;

  // Add CTG related methods
  saveCtgData(data: InsertCtgData): Promise<CtgData>;
  getCtgDataById(id: number): Promise<CtgData | undefined>;
  getAllCtgData(): Promise<CtgData[]>;
  getCtgDataByClass(classValue: number): Promise<CtgData[]>;
  analyzeMefiWithCtgData(mefiInput: {
    fcb: string;
    variabilidad: string;
    aceleraciones: string;
    desaceleraciones: string;
    movimientos?: string;
    duracionRegistro?: string;
  }): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'user_sessions'
    });
  }

  // User methods implementation
  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Existing methods remain unchanged
  async saveCalculation(calculation: InsertCalculation): Promise<Calculation> {
    const [saved] = await db.insert(calculations).values(calculation).returning();
    return saved;
  }

  async getCalculationById(id: number): Promise<Calculation | undefined> {
    const [calculation] = await db.select().from(calculations).where(eq(calculations.id, id));
    return calculation;
  }

  async getCalculationsByType(type: string): Promise<Calculation[]> {
    return await db.select().from(calculations).where(eq(calculations.calculatorType, type));
  }

  async savePatient(patient: InsertPatient): Promise<Patient> {
    const [saved] = await db.insert(patients).values(patient).returning();
    return saved;
  }

  async getPatientById(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async getAllPatients(): Promise<Patient[]> {
    return await db.select().from(patients);
  }

  async getCalculationHistory(
    patientId?: number,
    type?: string,
    limit: number = 50
  ): Promise<Calculation[]> {
    const conditions = [];

    if (patientId) {
      conditions.push(eq(calculations.patientId, patientId));
    }

    if (type) {
      conditions.push(eq(calculations.calculatorType, type));
    }

    const query = db
      .select()
      .from(calculations)
      .orderBy(desc(calculations.createdAt))
      .limit(limit);

    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }

    return await query;
  }

  async getCalculationsForComparison(
    comparisonGroup: string
  ): Promise<Calculation[]> {
    return await db
      .select()
      .from(calculations)
      .where(eq(calculations.comparisonGroup, comparisonGroup))
      .orderBy(desc(calculations.createdAt));
  }

  async updateCalculationNotes(
    id: number,
    notes: string
  ): Promise<Calculation> {
    const [updated] = await db
      .update(calculations)
      .set({ notes })
      .where(eq(calculations.id, id))
      .returning();
    return updated;
  }

  async saveCtgData(data: InsertCtgData): Promise<CtgData> {
    const [saved] = await db.insert(ctgData).values(data).returning();
    return saved;
  }

  async getCtgDataById(id: number): Promise<CtgData | undefined> {
    const [data] = await db.select().from(ctgData).where(eq(ctgData.id, id));
    return data;
  }

  async getAllCtgData(): Promise<CtgData[]> {
    return await db.select().from(ctgData);
  }

  async getCtgDataByClass(classValue: number): Promise<CtgData[]> {
    return await db
      .select()
      .from(ctgData)
      .where(eq(ctgData.class, classValue));
  }

  async analyzeMefiWithCtgData(mefiInput: {
    fcb: string;
    variabilidad: string;
    aceleraciones: string;
    desaceleraciones: string;
    movimientos?: string;
    duracionRegistro?: string;
  }): Promise<any> {
    // Convert MEFI input to numerical values based on CTG data ranges
    const numericalInput = {
      baseline: this.convertFcbToNumerical(mefiInput.fcb),
      variability: this.convertVariabilidadToNumerical(mefiInput.variabilidad),
      accelerations: this.convertAccelerationsToNumerical(mefiInput.aceleraciones),
      decelerations: this.convertDecelerationsToNumerical(mefiInput.desaceleraciones),
    };

    // Get similar cases from CTG database
    const similarCases = await db
      .select()
      .from(ctgData)
      .where(and(
        between(ctgData.lb, numericalInput.baseline - 10, numericalInput.baseline + 10),
        between(ctgData.mstv, numericalInput.variability - 1, numericalInput.variability + 1)
      ))
      .limit(10);

    // Analyze patterns and provide enhanced recommendations
    return this.generateEnhancedRecommendations(similarCases, numericalInput);
  }

  private convertFcbToNumerical(fcb: string): number {
    // Implement conversion logic based on MEFI categories
    const fcbRanges = {
      "Normal (110-160 lpm)": 135,
      "Taquicardia (>160 lpm)": 170,
      "Bradicardia (<110 lpm)": 100
    };
    return fcbRanges[fcb as keyof typeof fcbRanges] || 135;
  }

  private convertVariabilidadToNumerical(variabilidad: string): number {
    const variabilityRanges = {
      "Ausente (<2 lpm)": 0.5,
      "Mínima (2-5 lpm)": 3.5,
      "Moderada (6-25 lpm)": 15,
      "Marcada (>25 lpm)": 30
    };
    return variabilityRanges[variabilidad as keyof typeof variabilityRanges] || 15;
  }

  private convertAccelerationsToNumerical(accelerations: string): number {
    const accelerationRanges = {
      "Ausentes": 0,
      "Presentes": 5
    };
    return accelerationRanges[accelerations as keyof typeof accelerationRanges] || 0;
  }

  private convertDecelerationsToNumerical(decelerations: string): number {
    const decelerationRanges = {
      "Ausentes": 0,
      "Tempranas": 1,
      "Variables": 2,
      "Tardías": 3,
      "Prolongadas": 4
    };
    return decelerationRanges[decelerations as keyof typeof decelerationRanges] || 0;
  }

  private generateEnhancedRecommendations(similarCases: CtgData[], input: any): any {
    // Analyze similar cases to enhance recommendations
    const outcomes = similarCases.reduce((acc, curr) => {
      acc[curr.nsp] = (acc[curr.nsp] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Return enhanced recommendations based on historical data
    return {
      recommendationConfidence: this.calculateConfidence(outcomes),
      similarCasesCount: similarCases.length,
      historicalOutcomes: outcomes,
      baseRecommendation: this.getBaseRecommendation(input)
    };
  }

  private calculateConfidence(outcomes: Record<number, number>): number {
    const total = Object.values(outcomes).reduce((a, b) => a + b, 0);
    const maxCount = Math.max(...Object.values(outcomes));
    return (maxCount / total) * 100;
  }

  private getBaseRecommendation(input: any): string {
    // Implement base recommendation logic
    // This will be combined with historical data analysis
    return "Base recommendation based on current parameters";
  }
}

export const storage = new DatabaseStorage();