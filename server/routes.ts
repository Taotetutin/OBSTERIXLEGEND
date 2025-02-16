import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCalculationSchema, insertPatientSchema, calculatorTypes } from "@shared/schema";
import { desc } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // API routes for calculator operations
  app.post("/api/calculations", async (req, res) => {
    try {
      const calculation = insertCalculationSchema.parse(req.body);
      const saved = await storage.saveCalculation(calculation);
      res.json(saved);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  app.get("/api/calculations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const calculation = await storage.getCalculationById(id);
    if (!calculation) {
      res.status(404).json({ error: "Calculation not found" });
      return;
    }
    res.json(calculation);
  });

  app.get("/api/calculations/type/:type", async (req, res) => {
    const calculations = await storage.getCalculationsByType(req.params.type);
    res.json(calculations);
  });

  // API routes for patient operations
  app.post("/api/patients", async (req, res) => {
    try {
      const patient = insertPatientSchema.parse(req.body);
      const saved = await storage.savePatient(patient);
      res.json(saved);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const patient = await storage.getPatientById(id);
    if (!patient) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    res.json(patient);
  });

  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await storage.getAllPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // Nueva ruta para el análisis MEFI con CTG
  app.post("/api/mefi/analyze", async (req, res) => {
    try {
      const mefiInput = calculatorTypes.mefi.parse(req.body);
      const analysis = await storage.analyzeMefiWithCtgData(mefiInput);
      res.json(analysis);
    } catch (error) {
      console.error("Error in MEFI CTG analysis:", error);
      res.status(500).json({ error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}