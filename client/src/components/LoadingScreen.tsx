import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white">
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src="/loading.png"
          alt="ObsteriX Legend Loading"
          className="max-w-[90%] md:max-w-[70%] lg:max-w-[60%] h-auto object-contain"
        />
      </div>
    </div>
  );
}