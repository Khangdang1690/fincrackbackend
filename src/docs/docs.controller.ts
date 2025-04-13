import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('docs')
export class DocsController {
  @Get()
  redirectToApiDocs(@Res() res: Response) {
    return res.redirect('/api/docs/swagger');
  }

  @Get('swagger')
  serveSwaggerUi(@Res() res: Response) {
    // Serve a simple HTML page that loads Swagger UI
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>FinCrack API Documentation</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
        <style>
          html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
          *, *:before, *:after { box-sizing: inherit; }
          body { margin: 0; background: #fafafa; }
          .topbar { display: none; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
        <script>
          window.onload = function() {
            const ui = SwaggerUIBundle({
              url: "/api/docs/openapi",
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.SwaggerUIStandalonePreset
              ],
              layout: "BaseLayout",
              docExpansion: "list",
              supportedSubmitMethods: ["get", "post", "put", "delete"],
            });
            window.ui = ui;
          };
        </script>
      </body>
      </html>
    `;
    
    res.type('text/html').send(html);
  }

  @Get('openapi')
  serveOpenApiSpec(@Res() res: Response) {
    try {
      // Read the OpenAPI YAML file
      const apiDocPath = path.resolve(process.cwd(), 'src', 'common', 'api-doc.yaml');
      const yamlContent = fs.readFileSync(apiDocPath, 'utf8');
      
      // Send the YAML content
      res.type('text/yaml').send(yamlContent);
    } catch (error) {
      console.error('Error serving OpenAPI spec:', error);
      res.status(500).send('Error loading API documentation');
    }
  }
} 