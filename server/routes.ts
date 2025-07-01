import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { readdir } from "fs/promises";
import { join } from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // API endpoint for Las Vegas themed background options
  app.get('/api/las-vegas-images', async (req, res) => {
    try {
      // Read all images from the vegas_images folder
      const vegasImagePath = join(process.cwd(), 'attached_assets', 'vegas_images');
      const files = await readdir(vegasImagePath);
      
      // Filter for image files and create metadata
      const vegasBackgrounds = files
        .filter(file => file.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/))
        .map((filename, index) => {
          // Extract scene type from filename for better descriptions
          let description = 'Vegas battle scene';
          let sceneName = `vegas-scene-${index + 1}`;
          
          if (filename.includes('overview')) {
            description = 'Epic aerial overview of Vegas battlefield';
            sceneName = `vegas-overview-${index + 1}`;
          } else if (filename.includes('alley')) {
            description = 'Intense alley combat zone';
            sceneName = `vegas-alley-${index + 1}`;
          } else if (filename.includes('garage')) {
            description = 'Garage destruction battle';
            sceneName = `vegas-garage-${index + 1}`;
          } else if (filename.includes('freemont') || filename.includes('fremont')) {
            description = 'Fremont Street warfare';
            sceneName = `vegas-fremont-${index + 1}`;
          } else if (filename.includes('backstreets')) {
            description = 'Backstreets tactical combat';
            sceneName = `vegas-backstreets-${index + 1}`;
          } else if (filename.includes('layer')) {
            description = 'Strategic layer battlefield';
            sceneName = `vegas-layer-${index + 1}`;
          }
          
          return {
            name: sceneName,
            description: description,
            url: `/vegas-images/${filename}`
          };
        });

      console.log(`Loaded ${vegasBackgrounds.length} Vegas background images`);
      res.json(vegasBackgrounds);
    } catch (error) {
      console.error('Error loading Vegas images:', error);
      // Fallback to basic response if directory read fails
      res.json([{
        name: 'vegas-default',
        description: 'Default Vegas scene',
        url: '/vegas-images/robert-berg-screenshot-alley-1-2024-11-17-13-57-0000-screenshot-overview-3-2024-11-17-13-58.jpg'
      }]);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
