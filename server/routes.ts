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
    // Provide Vegas-themed background URLs
    const vegasBackgrounds = [
      {
        name: 'vegas-neon-lights',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop'
      },
      {
        name: 'vegas-casino-strip',
        url: 'https://images.unsplash.com/photo-1551316679-9c3e36883d3c?w=1280&h=720&fit=crop'
      },
      {
        name: 'vegas-golden-sunset',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1280&h=720&fit=crop'
      },
      {
        name: 'vegas-night-skyline',
        url: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=1280&h=720&fit=crop'
      },
      {
        name: 'vegas-casino-interior',
        url: 'https://images.unsplash.com/photo-1574414237975-5a14fec2b9fb?w=1280&h=720&fit=crop'
      },
      {
        name: 'vegas-luxury-hotel',
        url: 'https://images.unsplash.com/photo-1540559827-32f9f4322a4d?w=1280&h=720&fit=crop'
      },
      {
        name: 'vegas-fountain-show',
        url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1280&h=720&fit=crop'
      },
      {
        name: 'vegas-bright-signs',
        url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1280&h=720&fit=crop'
      }
    ];
    res.json(vegasBackgrounds);
  });

  const httpServer = createServer(app);

  return httpServer;
}
