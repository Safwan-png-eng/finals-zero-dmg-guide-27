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
    // Provide custom Vegas-themed backgrounds from The Finals game
    const vegasBackgrounds = [
      {
        name: 'vegas-overview-battle',
        description: 'Epic aerial view of Vegas battlefield',
        url: '/vegas-images/robert-berg-screenshot-alley-1-2024-11-17-13-57-0000-screenshot-overview-3-2024-11-17-13-58.jpg'
      },
      {
        name: 'vegas-neon-alley',
        description: 'Dark alley with neon lighting',
        url: '/vegas-images/robert-berg-screenshot-alley-1-2024-11-17-13-57-0034-screenshot-alley-8-2024-11-17-13-58.jpg'
      },
      {
        name: 'vegas-garage-chaos',
        description: 'Destruction in Vegas garage',
        url: '/vegas-images/robert-berg-screenshot-alley-1-2024-11-17-13-57-0003-screenshot-garage-8-2024-11-17-13-58.jpg'
      },
      {
        name: 'vegas-fremont-street',
        description: 'Fremont Street battle zone',
        url: '/vegas-images/robert-berg-screenshot-alley-2-2024-11-17-14-4-0003-screenshot-freemont-15-2024-11-17-14-5.jpg'
      },
      {
        name: 'vegas-backstreets-action',
        description: 'Intense backstreets combat',
        url: '/vegas-images/robert-berg-screenshot-alley-2-2024-11-17-14-4-0018-screenshot-backstreets-10-2024-11-17-14-5.jpg'
      },
      {
        name: 'vegas-casino-warfare',
        description: 'Casino district battle',
        url: '/vegas-images/robert-berg-screenshot-alley-2-2024-11-17-14-4-0000-screenshot-garage-3-2024-11-17-14-6.jpg'
      },
      {
        name: 'vegas-strip-overview',
        description: 'Panoramic Vegas Strip view',
        url: '/vegas-images/robert-berg-screenshot-alley-2-2024-11-17-14-4-0032-screenshot-overview-5-2024-11-17-14-5.jpg'
      },
      {
        name: 'vegas-alley-showdown',
        description: 'Narrow alley combat scene',
        url: '/vegas-images/robert-berg-screenshot-alley-2-2024-11-17-14-4-0027-screenshot-alley-15-2024-11-17-14-5.jpg'
      }
    ];
    res.json(vegasBackgrounds);
  });

  const httpServer = createServer(app);

  return httpServer;
}
