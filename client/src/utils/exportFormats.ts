// Advanced Export System - Krita, PowerPoint, and other formats
import JSZip from 'jszip';

interface ThumbnailConfig {
  mainText: string;
  subText: string;
  backgroundPreset: string;
  textColor: string;
  accentColor: string;
  fontSize: string;
  textPosition: string;
  overlayImage: string | null;
  overlayImageSize: number;
  characterPosition?: string;
  characterHorizontalOffset?: number;
  characterVerticalOffset?: number;
  glowEffect?: boolean;
  borderGlow?: boolean;
  textShadow?: boolean;
  textOutline?: boolean;
  [key: string]: any;
}

// Krita Project (.kra) Export
export const exportToKrita = async (config: ThumbnailConfig, canvasData: string): Promise<Blob> => {
  const zip = new JSZip();
  
  // Create Krita project structure
  const documentInfo = `<?xml version="1.0" encoding="UTF-8"?>
<document-info xmlns="http://www.calligra.org/DTD/document-info">
    <about>
        <title>YouTube Thumbnail</title>
        <subject>Gaming Thumbnail</subject>
        <abstract>Generated thumbnail for gaming content</abstract>
        <keyword>gaming, thumbnail, youtube</keyword>
    </about>
    <author>
        <full-name>Thumbnail Generator</full-name>
        <creator-first-name>Thumbnail</creator-first-name>
        <creator-last-name>Generator</creator-last-name>
        <email>creator@thumbnailgen.com</email>
    </author>
</document-info>`;

  // Main document XML for Krita
  const mainDoc = `<?xml version="1.0" encoding="UTF-8"?>
<DOC xmlns="http://www.calligra.org/DTD/document" mime="application/x-krita" version="2.0" syntaxVersion="2" editor="Krita">
    <PAPER format="A0" orientation="0" columnspacing="3" columns="1" width="1280" height="720" unit="0" />
    <ATTRIBUTES processing="1" standardpage="1" hasHeader="0" hasFooter="0" unit="0"/>
    <FRAMESETS>
        <FRAMESET frameType="1" frameInfo="0" name="Hoofdtekst" visible="1" pageViewPageNumber="0">
            <FRAME left="28" top="42" right="567" bottom="798" />
        </FRAMESET>
    </FRAMESETS>
</DOC>`;

  // Layer structure for Krita
  const layerStructure = `{
    "layers": [
        {
            "name": "Background",
            "type": "paintlayer",
            "visible": true,
            "opacity": 255,
            "blendMode": "normal"
        },
        {
            "name": "Character",
            "type": "paintlayer", 
            "visible": true,
            "opacity": 255,
            "blendMode": "normal"
        },
        {
            "name": "Main Text",
            "type": "textlayer",
            "visible": true,
            "opacity": 255,
            "blendMode": "normal",
            "text": "${config.mainText}",
            "font": "Impact",
            "fontSize": 72,
            "color": "${config.textColor}"
        },
        {
            "name": "Sub Text", 
            "type": "textlayer",
            "visible": true,
            "opacity": 255,
            "blendMode": "normal",
            "text": "${config.subText}",
            "font": "Impact",
            "fontSize": 36,
            "color": "${config.accentColor}"
        },
        {
            "name": "Effects",
            "type": "grouplayer",
            "visible": true,
            "opacity": 255,
            "blendMode": "normal"
        }
    ],
    "canvas": {
        "width": 1280,
        "height": 720,
        "resolution": 72
    },
    "metadata": {
        "generator": "Thumbnail Generator",
        "version": "1.0",
        "created": "${new Date().toISOString()}"
    }
}`;

  // Convert canvas to PNG for embedding
  const canvasBlob = await fetch(canvasData).then(res => res.blob());
  
  // Add files to Krita project structure
  zip.file('documentinfo.xml', documentInfo);
  zip.file('maindoc.xml', mainDoc);
  zip.file('layers.json', layerStructure);
  zip.file('preview.png', canvasBlob);
  zip.file('mergedimage.png', canvasBlob);
  
  // Create layer data
  zip.folder('layers');
  zip.file('layers/background.png', canvasBlob);
  
  // Mimetype file (required for Krita)
  zip.file('mimetype', 'application/x-krita', {compression: 'STORE'});
  
  return await zip.generateAsync({type: 'blob'});
};

// PowerPoint (.pptx) Export
export const exportToPowerPoint = async (config: ThumbnailConfig, canvasData: string): Promise<Blob> => {
  const zip = new JSZip();
  
  // PowerPoint structure
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Default Extension="png" ContentType="image/png"/>
    <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-presentationml.presentation.main+xml"/>
    <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-presentationml.slide+xml"/>
    <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-presentationml.slideLayout+xml"/>
    <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-presentationml.slideMaster+xml"/>
    <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
</Types>`;

  const appProps = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
    <Application>Thumbnail Generator</Application>
    <DocSecurity>0</DocSecurity>
    <Lines>0</Lines>
    <Paragraphs>0</Paragraphs>
    <ScaleCrop>false</ScaleCrop>
    <Company>Thumbnail Generator</Company>
    <LinksUpToDate>false</LinksUpToDate>
    <SharedDoc>false</SharedDoc>
    <HyperlinksChanged>false</HyperlinksChanged>
    <AppVersion>1.0000</AppVersion>
</Properties>`;

  const coreProps = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <dc:title>YouTube Thumbnail</dc:title>
    <dc:subject>Gaming Thumbnail Template</dc:subject>
    <dc:creator>Thumbnail Generator</dc:creator>
    <cp:keywords>gaming, youtube, thumbnail, editable</cp:keywords>
    <dc:description>Editable YouTube thumbnail template for gaming content</dc:description>
    <cp:lastModifiedBy>Thumbnail Generator</cp:lastModifiedBy>
    <cp:revision>1</cp:revision>
    <dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
    <dcterms:modified xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:modified>
</cp:coreProperties>`;

  const presentation = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
    <p:sldMasterIdLst>
        <p:sldMasterId id="2147483648" r:id="rId1"/>
    </p:sldMasterIdLst>
    <p:sldIdLst>
        <p:sldId id="256" r:id="rId2"/>
    </p:sldIdLst>
    <p:sldSz cx="12192000" cy="6858000" type="screen16x9"/>
    <p:notesSz cx="6858000" cy="9144000"/>
    <p:defaultTextStyle>
        <a:defPPr>
            <a:defRPr lang="en-US"/>
        </a:defPPr>
    </p:defaultTextStyle>
</p:presentation>`;

  const slide1 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
    <p:cSld>
        <p:spTree>
            <p:nvGrpSpPr>
                <p:cNvPr id="1" name=""/>
                <p:cNvGrpSpPr/>
                <p:nvPr/>
            </p:nvGrpSpPr>
            <p:grpSpPr>
                <a:xfrm>
                    <a:off x="0" y="0"/>
                    <a:ext cx="0" cy="0"/>
                    <a:chOff x="0" y="0"/>
                    <a:chExt cx="0" cy="0"/>
                </a:xfrm>
            </p:grpSpPr>
            
            <!-- Background Image -->
            <p:pic>
                <p:nvPicPr>
                    <p:cNvPr id="2" name="Background" descr="Thumbnail Background"/>
                    <p:cNvPicPr/>
                    <p:nvPr/>
                </p:nvPicPr>
                <p:blipFill>
                    <a:blip r:embed="rId1"/>
                    <a:stretch>
                        <a:fillRect/>
                    </a:stretch>
                </p:blipFill>
                <p:spPr>
                    <a:xfrm>
                        <a:off x="0" y="0"/>
                        <a:ext cx="12192000" cy="6858000"/>
                    </a:xfrm>
                    <a:prstGeom prst="rect">
                        <a:avLst/>
                    </a:prstGeom>
                </p:spPr>
            </p:pic>
            
            <!-- Main Text -->
            <p:sp>
                <p:nvSpPr>
                    <p:cNvPr id="3" name="Main Text"/>
                    <p:cNvSpPr txBox="1"/>
                    <p:nvPr/>
                </p:nvSpPr>
                <p:spPr>
                    <a:xfrm>
                        <a:off x="914400" y="1828800"/>
                        <a:ext cx="7315200" cy="1828800"/>
                    </a:xfrm>
                    <a:prstGeom prst="rect">
                        <a:avLst/>
                    </a:prstGeom>
                    <a:noFill/>
                </p:spPr>
                <p:txBody>
                    <a:bodyPr wrap="none" rtlCol="0">
                        <a:spAutoFit/>
                    </a:bodyPr>
                    <a:lstStyle/>
                    <a:p>
                        <a:pPr algn="l"/>
                        <a:r>
                            <a:rPr lang="en-US" sz="7200" b="1">
                                <a:solidFill>
                                    <a:srgbClr val="${config.textColor.replace('#', '')}"/>
                                </a:solidFill>
                                <a:latin typeface="Impact"/>
                            </a:rPr>
                            <a:t>${config.mainText}</a:t>
                        </a:r>
                    </a:p>
                </p:txBody>
            </p:sp>
            
            <!-- Sub Text -->
            <p:sp>
                <p:nvSpPr>
                    <p:cNvPr id="4" name="Sub Text"/>
                    <p:cNvSpPr txBox="1"/>
                    <p:nvPr/>
                </p:nvSpPr>
                <p:spPr>
                    <a:xfrm>
                        <a:off x="914400" y="3657600"/>
                        <a:ext cx="7315200" cy="914400"/>
                    </a:xfrm>
                    <a:prstGeom prst="rect">
                        <a:avLst/>
                    </a:prstGeom>
                    <a:noFill/>
                </p:spPr>
                <p:txBody>
                    <a:bodyPr wrap="none" rtlCol="0">
                        <a:spAutoFit/>
                    </a:bodyPr>
                    <a:lstStyle/>
                    <a:p>
                        <a:pPr algn="l"/>
                        <a:r>
                            <a:rPr lang="en-US" sz="3600" b="1">
                                <a:solidFill>
                                    <a:srgbClr val="${config.accentColor.replace('#', '')}"/>
                                </a:solidFill>
                                <a:latin typeface="Impact"/>
                            </a:rPr>
                            <a:t>${config.subText}</a:t>
                        </a:r>
                    </a:p>
                </p:txBody>
            </p:sp>
        </p:spTree>
    </p:cSld>
    <p:clrMapOvr>
        <a:masterClrMapping/>
    </p:clrMapOvr>
</p:sld>`;

  // Convert canvas to PNG
  const canvasBlob = await fetch(canvasData).then(res => res.blob());
  
  // Main structure
  zip.file('[Content_Types].xml', contentTypes);
  zip.file('docProps/app.xml', appProps);
  zip.file('docProps/core.xml', coreProps);
  
  // Relationships
  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
    <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
    <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`);

  zip.file('ppt/_rels/presentation.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
    <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>
    <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
</Relationships>`);

  zip.file('ppt/slides/_rels/slide1.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image1.png"/>
</Relationships>`);

  // Content files
  zip.file('ppt/presentation.xml', presentation);
  zip.file('ppt/slides/slide1.xml', slide1);
  zip.file('ppt/media/image1.png', canvasBlob);
  
  // Theme and layout files (minimal)
  zip.file('ppt/theme/theme1.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme">
    <a:themeElements>
        <a:clrScheme name="Office">
            <a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>
            <a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>
            <a:dk2><a:srgbClr val="44546A"/></a:dk2>
            <a:lt2><a:srgbClr val="E7E6E6"/></a:lt2>
            <a:accent1><a:srgbClr val="5B9BD5"/></a:accent1>
            <a:accent2><a:srgbClr val="70AD47"/></a:accent2>
            <a:accent3><a:srgbClr val="A5A5A5"/></a:accent3>
            <a:accent4><a:srgbClr val="FFC000"/></a:accent4>
            <a:accent5><a:srgbClr val="4472C4"/></a:accent5>
            <a:accent6><a:srgbClr val="C55A11"/></a:accent6>
            <a:hlink><a:srgbClr val="0563C1"/></a:hlink>
            <a:folHlink><a:srgbClr val="954F72"/></a:folHlink>
        </a:clrScheme>
        <a:fontScheme name="Office">
            <a:majorFont>
                <a:latin typeface="Calibri Light" panose="020F0302020204030204"/>
                <a:ea typeface=""/>
                <a:cs typeface=""/>
            </a:majorFont>
            <a:minorFont>
                <a:latin typeface="Calibri" panose="020F0502020204030204"/>
                <a:ea typeface=""/>
                <a:cs typeface=""/>
            </a:minorFont>
        </a:fontScheme>
        <a:fmtScheme name="Office">
            <a:fillStyleLst>
                <a:solidFill><a:schemeClr val="phClr"/></a:solidFill>
                <a:gradFill rotWithShape="1">
                    <a:gsLst>
                        <a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs>
                        <a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs>
                        <a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs>
                    </a:gsLst>
                    <a:lin ang="5400000" scaled="0"/>
                </a:gradFill>
                <a:gradFill rotWithShape="1">
                    <a:gsLst>
                        <a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs>
                        <a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs>
                        <a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs>
                    </a:gsLst>
                    <a:lin ang="5400000" scaled="0"/>
                </a:gradFill>
            </a:fillStyleLst>
            <a:lnStyleLst>
                <a:ln w="6350" cap="flat" cmpd="sng" algn="ctr">
                    <a:solidFill><a:schemeClr val="phClr"/></a:solidFill>
                    <a:prstDash val="solid"/>
                    <a:miter lim="800000"/>
                </a:ln>
                <a:ln w="12700" cap="flat" cmpd="sng" algn="ctr">
                    <a:solidFill><a:schemeClr val="phClr"/></a:solidFill>
                    <a:prstDash val="solid"/>
                    <a:miter lim="800000"/>
                </a:ln>
                <a:ln w="19050" cap="flat" cmpd="sng" algn="ctr">
                    <a:solidFill><a:schemeClr val="phClr"/></a:solidFill>
                    <a:prstDash val="solid"/>
                    <a:miter lim="800000"/>
                </a:ln>
            </a:lnStyleLst>
            <a:effectStyleLst>
                <a:effectStyle>
                    <a:effectLst/>
                </a:effectStyle>
                <a:effectStyle>
                    <a:effectLst/>
                </a:effectStyle>
                <a:effectStyle>
                    <a:effectLst>
                        <a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0">
                            <a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr>
                        </a:outerShdw>
                    </a:effectLst>
                </a:effectStyle>
            </a:effectStyleLst>
            <a:bgFillStyleLst>
                <a:solidFill><a:schemeClr val="phClr"/></a:solidFill>
                <a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill>
                <a:gradFill rotWithShape="1">
                    <a:gsLst>
                        <a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs>
                        <a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs>
                        <a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs>
                    </a:gsLst>
                    <a:lin ang="5400000" scaled="0"/>
                </a:gradFill>
            </a:bgFillStyleLst>
        </a:fmtScheme>
    </a:themeElements>
</a:theme>`);

  return await zip.generateAsync({type: 'blob'});
};

// Photoshop PSD Export (simplified)
export const exportToPSD = async (config: ThumbnailConfig, canvasData: string): Promise<Blob> => {
  // This would require a more complex PSD generator
  // For now, we'll create a simplified version with layer information
  const layerInfo = {
    format: 'PSD',
    version: '1.0',
    width: 1280,
    height: 720,
    layers: [
      {
        name: 'Background',
        type: 'background',
        blendMode: 'normal',
        opacity: 100,
        visible: true
      },
      {
        name: 'Character',
        type: 'image',
        blendMode: 'normal',
        opacity: 100,
        visible: true,
        position: {
          x: config.characterHorizontalOffset || 0,
          y: config.characterVerticalOffset || 0
        },
        size: config.overlayImageSize || 25
      },
      {
        name: 'Main Text',
        type: 'text',
        content: config.mainText,
        font: 'Impact',
        fontSize: 72,
        color: config.textColor,
        position: config.textPosition,
        effects: {
          shadow: config.textShadow,
          outline: config.textOutline,
          glow: config.glowEffect
        }
      },
      {
        name: 'Sub Text',
        type: 'text',
        content: config.subText,
        font: 'Impact',
        fontSize: 36,
        color: config.accentColor
      }
    ],
    metadata: {
      generator: 'Thumbnail Generator',
      created: new Date().toISOString(),
      config: config
    }
  };

  // Convert to blob (this would need a proper PSD encoder)
  const psdData = JSON.stringify(layerInfo, null, 2);
  return new Blob([psdData], { type: 'application/json' });
};

// SVG Export (vector format)
export const exportToSVG = async (config: ThumbnailConfig): Promise<Blob> => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .main-text { 
        font-family: Impact, Arial Black, sans-serif; 
        font-size: 72px; 
        font-weight: bold; 
        fill: ${config.textColor}; 
        ${config.textShadow ? `filter: drop-shadow(4px 4px 8px rgba(0,0,0,0.7));` : ''}
      }
      .sub-text { 
        font-family: Impact, Arial Black, sans-serif; 
        font-size: 36px; 
        font-weight: bold; 
        fill: ${config.accentColor}; 
      }
      .glow-effect {
        filter: drop-shadow(0 0 20px ${config.accentColor});
      }
    </style>
    ${config.glowEffect ? `
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>` : ''}
  </defs>
  
  <!-- Background -->
  <rect width="1280" height="720" fill="url(#bg-gradient)"/>
  
  <!-- Background Gradient based on preset -->
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      ${config.backgroundPreset === 'las-vegas' ? `
        <stop offset="0%" style="stop-color:#1a0a00;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff6600;stop-opacity:1" />
      ` : config.backgroundPreset === 'finals-arena' ? `
        <stop offset="0%" style="stop-color:#0f0f1a;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff0080;stop-opacity:1" />
      ` : `
        <stop offset="0%" style="stop-color:#0f0f23;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#2d1b69;stop-opacity:1" />
      `}
    </linearGradient>
  </defs>
  
  <!-- Main Text -->
  <text x="100" y="200" class="main-text ${config.glowEffect ? 'glow-effect' : ''}">${config.mainText}</text>
  
  <!-- Sub Text -->
  <text x="100" y="280" class="sub-text">${config.subText}</text>
  
  <!-- Character placeholder -->
  ${config.overlayImage ? `
  <rect x="800" y="200" width="400" height="400" fill="rgba(255,255,255,0.1)" stroke="${config.accentColor}" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="1000" y="410" text-anchor="middle" fill="${config.accentColor}" font-family="Arial" font-size="16">Character Image</text>
  ` : ''}
  
  <!-- Metadata -->
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description rdf:about=""
          xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:title>YouTube Thumbnail</dc:title>
        <dc:creator>Thumbnail Generator</dc:creator>
        <dc:description>Editable SVG thumbnail template</dc:description>
        <dc:format>image/svg+xml</dc:format>
      </rdf:Description>
    </rdf:RDF>
  </metadata>
</svg>`;

  return new Blob([svg], { type: 'image/svg+xml' });
};

// After Effects Project Export (JSON format that can be imported)
export const exportToAfterEffects = async (config: ThumbnailConfig): Promise<Blob> => {
  const aeProject = {
    version: "2023.0",
    project: {
      name: "YouTube Thumbnail",
      width: 1280,
      height: 720,
      frameRate: 30,
      duration: 5,
      backgroundColor: "#000000"
    },
    compositions: [
      {
        name: "Main Comp",
        width: 1280,
        height: 720,
        duration: 5,
        frameRate: 30,
        layers: [
          {
            name: "Background",
            type: "solid",
            color: config.backgroundPreset === 'las-vegas' ? "#ff6600" : "#2d1b69",
            width: 1280,
            height: 720,
            duration: 5
          },
          {
            name: "Main Text",
            type: "text",
            text: config.mainText,
            font: "Impact",
            fontSize: 72,
            color: config.textColor,
            position: [640, 200],
            anchor: [0.5, 0.5],
            duration: 5,
            animations: config.animatedText ? [
              {
                property: "scale",
                keyframes: [
                  { time: 0, value: [80, 80] },
                  { time: 0.5, value: [100, 100] }
                ]
              },
              {
                property: "opacity",
                keyframes: [
                  { time: 0, value: 0 },
                  { time: 0.5, value: 100 }
                ]
              }
            ] : []
          },
          {
            name: "Sub Text",
            type: "text",
            text: config.subText,
            font: "Impact",
            fontSize: 36,
            color: config.accentColor,
            position: [640, 280],
            anchor: [0.5, 0.5],
            duration: 5,
            animations: config.animatedText ? [
              {
                property: "position",
                keyframes: [
                  { time: 0.5, value: [640, 300] },
                  { time: 1, value: [640, 280] }
                ]
              }
            ] : []
          },
          {
            name: "Character",
            type: "image",
            source: "character.png",
            position: [1000, 400],
            scale: [config.overlayImageSize || 25, config.overlayImageSize || 25],
            anchor: [0.5, 1],
            duration: 5,
            effects: config.glowEffect ? [
              {
                name: "Glow",
                type: "glow",
                intensity: 50,
                threshold: 50,
                radius: 20,
                color: config.accentColor
              }
            ] : []
          }
        ]
      }
    ],
    assets: [
      {
        name: "character.png",
        type: "image",
        path: "./character.png"
      }
    ],
    metadata: {
      generator: "Thumbnail Generator",
      version: "1.0",
      created: new Date().toISOString(),
      config: config
    }
  };

  const aeData = JSON.stringify(aeProject, null, 2);
  return new Blob([aeData], { type: 'application/json' });
};

// Main export function
export const exportToFormat = async (
  format: 'krita' | 'powerpoint' | 'psd' | 'svg' | 'aftereffects',
  config: ThumbnailConfig,
  canvasData: string
): Promise<{ blob: Blob; filename: string }> => {
  const timestamp = new Date().toISOString().split('T')[0];
  const baseFilename = `thumbnail-${timestamp}`;
  
  let blob: Blob;
  let filename: string;
  
  switch (format) {
    case 'krita':
      blob = await exportToKrita(config, canvasData);
      filename = `${baseFilename}.kra`;
      break;
    case 'powerpoint':
      blob = await exportToPowerPoint(config, canvasData);
      filename = `${baseFilename}.pptx`;
      break;
    case 'psd':
      blob = await exportToPSD(config, canvasData);
      filename = `${baseFilename}.psd.json`;
      break;
    case 'svg':
      blob = await exportToSVG(config);
      filename = `${baseFilename}.svg`;
      break;
    case 'aftereffects':
      blob = await exportToAfterEffects(config);
      filename = `${baseFilename}-ae-project.json`;
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
  
  return { blob, filename };
};