import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // API endpoint for Las Vegas themed background options
  app.get('/api/las-vegas-images', (req, res) => {
    // Provide Vegas-themed background options
    const vegasBackgrounds = [
      'vegas-neon-lights',
      'vegas-casino-strip',
      'vegas-golden-sunset',
      'vegas-night-skyline',
      'vegas-casino-interior',
      'vegas-luxury-hotel',
      'vegas-fountain-show',
      'vegas-bright-signs'
    ];
    res.json(vegasBackgrounds);
  });

  const httpServer = createServer(app);

  return httpServer;
}
