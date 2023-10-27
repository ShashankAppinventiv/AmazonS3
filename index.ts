import express, { Express } from "express"
import { amazonS3 } from "./src/provider/amazonS3";
class App {
  private app!: Express;
  private port!: number;
  constructor() {
    this.startApp();
  }
  startApp() {
    this.app = express();
    this.loadGlobalMiddleWare();
    this.loadRouter();
    this.initServer();
  }
  loadGlobalMiddleWare() {
    this.app.use(express.json());
    this.port = 3001;
}
  loadRouter() {
    // amazonS3.uploadImageToS3('https://www.edamam.com/food-img/90d/90dcfa94f6d38aea879fdf50322b6524.jpg');
    // amazonS3.createBucket();
    // amazonS3.getImage();
    amazonS3.getPresignedUrl('unnamed.jpg');
  }
  initServer() {
    this.app.listen(this.port, this.callback);
  }
  private callback = () => {
    console.log(`Server listing on port: ${this.port}`);
  };
}
(async () => {
  new App();
})();