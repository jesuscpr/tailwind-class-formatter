import * as vscode from 'vscode';

// Grupos de clases de Tailwind organizados por categoría
const tailwindGroups = {
  layout: ['container', 'box-', 'block', 'inline', 'flex', 'grid', 'table', 'hidden', 'float-', 'clear-', 'object-', 'overflow-', 'overscroll-', 'static', 'fixed', 'absolute', 'relative', 'sticky', 'isolate', 'isolation-', 'inset-', 'top-', 'right-', 'bottom-', 'left-', 'visible', 'invisible', 'z-', 'items-', 'justify-', 'self-'],
  sizing: ['w-', 'h-', 'min-w-', 'min-h-', 'max-w-', 'max-h-', 'size-'],
  spacing: ['p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-', 'ps-', 'pe-', 'm-', 'mx-', 'my-', 'mt-', 'mr-', 'mb-', 'ml-', 'ms-', 'me-', 'space-'],
  typography: ['font-', 'text-', 'antialiased', 'subpixel-', 'italic', 'not-italic', 'normal-nums', 'ordinal', 'slashed-zero', 'lining-nums', 'oldstyle-nums', 'proportional-nums', 'tabular-nums', 'diagonal-fractions', 'stacked-fractions', 'leading-', 'tracking-', 'line-clamp-', 'break-', 'truncate', 'text-ellipsis', 'text-clip', 'hyphens-', 'uppercase', 'lowercase', 'capitalize', 'normal-case', 'underline', 'overline', 'line-through', 'no-underline', 'decoration-', 'underline-offset-', 'indent-', 'align-', 'whitespace-', 'text-wrap', 'text-nowrap', 'text-balance', 'text-pretty'],
  background: ['bg-', 'from-', 'via-', 'to-', 'background-'],
  borders: ['border', 'rounded', 'divide-', 'outline-', 'ring-'],
  effects: ['shadow-', 'opacity-', 'mix-', 'blur-', 'brightness-', 'contrast-', 'grayscale', 'hue-rotate-', 'invert', 'saturate-', 'sepia', 'backdrop-', 'transition', 'duration-', 'ease-', 'delay-', 'animate-'],
  filters: ['filter', 'backdrop-filter'],
  interactivity: ['appearance-', 'cursor-', 'caret-', 'pointer-events-', 'resize-', 'scroll-', 'snap-', 'touch-', 'select-', 'will-change-'],
  svg: ['fill-', 'stroke-'],
  accessibility: ['sr-only', 'not-sr-only', 'forced-color-adjust-'],
  transforms: ['scale-', 'rotate-', 'translate-', 'skew-', 'transform', 'origin-']
};

// Orden de breakpoints para ordenar variantes responsive
const breakpointOrder = ['sm', 'md', 'lg', 'xl', '2xl'];

function getBaseClassName(className: string): string {
  // Elimina todos los prefijos de variantes (hover:, dark:, sm:, etc.) para obtener la clase base
  return className.replace(/^([a-z0-9]+:)+/, '');
}

function getClassProperty(className: string): string {
  // Extrae la propiedad base de la clase (ej: "pt-4" -> "pt", "bg-gray-100" -> "bg")
  const baseClass = getBaseClassName(className);
  const match = baseClass.match(/^([a-z]+)/);
  return match ? match[1] : baseClass;
}

function getBreakpoint(className: string): string | null {
  // Extrae el breakpoint si existe (sm:, md:, lg:, xl:, 2xl:)
  const match = className.match(/^(sm|md|lg|xl|2xl):/);
  return match ? match[1] : null;
}

function getBreakpointWeight(className: string): number {
  // Retorna un peso para ordenar: sin breakpoint = -1, sm = 0, md = 1, etc.
  const breakpoint = getBreakpoint(className);
  if (!breakpoint) {return -1;};
  return breakpointOrder.indexOf(breakpoint);
}

function groupResponsiveClasses(classes: string[]): string[][] {
  // Agrupa clases que comparten la misma propiedad base
  const propertyGroups: { [key: string]: string[] } = {};
  
  classes.forEach(className => {
    const property = getClassProperty(className);
    if (!propertyGroups[property]) {
      propertyGroups[property] = [];
    }
    propertyGroups[property].push(className);
  });
  
  // Convertir a array de grupos y ordenar cada grupo por breakpoint
  const result: string[][] = [];
  Object.keys(propertyGroups).forEach(property => {
    const group = propertyGroups[property];
    
    // Ordenar: primero la clase sin breakpoint, luego por orden de breakpoint
    group.sort((a, b) => {
      const weightA = getBreakpointWeight(a);
      const weightB = getBreakpointWeight(b);
      return weightA - weightB;
    });
    
    result.push(group);
  });
  
  return result;
}

function classifyTailwindClass(className: string): string {
  // Manejo de variantes (dark:, hover:, etc.)
  const variantMatch = className.match(/^([a-z0-9]+:)+(.+)$/);
  const baseClass = variantMatch ? variantMatch[2] : className;
  
  for (const [group, prefixes] of Object.entries(tailwindGroups)) {
    for (const prefix of prefixes) {
      if (baseClass.startsWith(prefix) || baseClass === prefix.replace('-', '')) {
        return group;
      }
    }
  }
  
  return 'other';
}

function formatTailwindClasses(
  classString: string, 
  baseIndent: string, 
  attributeIndent: string, 
  closeQuoteOnNewLine: boolean,
  maxLineWidth: number,
  wrapIndentStyle: string
): string {
  // Extraer todas las clases
  const classes = classString.split(/\s+/).filter(c => c.length > 0);
  
  // Agrupar clases por categoría de Tailwind
  const grouped: { [key: string]: string[] } = {};
  
  classes.forEach(className => {
    const group = classifyTailwindClass(className);
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(className);
  });
  
  // Orden preferido de grupos
  const groupOrder = ['layout', 'sizing', 'spacing', 'typography', 'background', 'borders', 'effects', 'filters', 'transforms', 'interactivity', 'svg', 'accessibility', 'other'];
  
  // Construir el string formateado
  const lines: string[] = [];
  const classIndent = attributeIndent + '  '; // 2 espacios más que el atributo class
  const wrapIndent = wrapIndentStyle === 'extra' ? classIndent + '  ' : classIndent;
  
  groupOrder.forEach(group => {
    if (grouped[group] && grouped[group].length > 0) {
      // Agrupar clases responsive dentro de cada categoría
      const responsiveGroups = groupResponsiveClasses(grouped[group]);
      
      // Procesar cada grupo responsive de esta categoría
      let categoryLine = '';
      
      responsiveGroups.forEach((respGroup, index) => {
        const respGroupStr = respGroup.join(' ');
        
        if (maxLineWidth === 0) {
          // Sin límite de ancho, cada grupo responsive en su propia línea
          lines.push(classIndent + respGroupStr);
        } else {
          // Intentar combinar grupos responsive de la MISMA categoría
          if (index === 0) {
            // Primer grupo responsive de esta categoría
            categoryLine = classIndent + respGroupStr;
          } else {
            // Intentar añadir el siguiente grupo responsive a la línea de la categoría
            const testLine = categoryLine + ' ' + respGroupStr;
            
            if (testLine.length <= maxLineWidth) {
              // Cabe en la misma línea
              categoryLine = testLine;
            } else {
              // No cabe, guardar la línea actual y empezar una nueva
              lines.push(categoryLine);
              categoryLine = wrapIndent + respGroupStr;
            }
          }
        }
      });
      
      // Guardar la última línea de esta categoría (solo si maxLineWidth > 0)
      if (maxLineWidth > 0 && categoryLine.length > 0) {
        lines.push(categoryLine);
      }
    }
  });
  
  if (closeQuoteOnNewLine) {
    // Comillas en nueva línea
    return '\n' + lines.join('\n') + '\n' + attributeIndent;
  } else {
    // Comillas en la misma línea que la última clase
    return '\n' + lines.join('\n');
  }
}

function formatDocument(document: vscode.TextDocument): vscode.TextEdit[] {
  const edits: vscode.TextEdit[] = [];
  const text = document.getText();
  
  // Obtener configuración
  const config = vscode.workspace.getConfiguration('tailwindFormatter');
  const closeQuoteOnNewLine = config.get<boolean>('closeQuoteOnNewLine', true);
  const maxLineWidth = config.get<number>('maxLineWidth', 80);
  const wrapIndentStyle = config.get<string>('wrapIndentStyle', 'same');
  
  // Regex para encontrar la etiqueta completa con class
  // Captura: <tagname otros-atributos class="..." posibles-atributos-después >
  const tagWithClassRegex = /<(\w+)([^>]*?)class(?:Name)?=["']([^"']+)["']([^>]*?)>/g;
  let match;
  
  while ((match = tagWithClassRegex.exec(text)) !== null) {
    const fullMatch = match[0];
    const tagName = match[1];
    const beforeClass = match[2];
    const classContent = match[3];
    const afterClass = match[4];
    
    const startPos = document.positionAt(match.index);
    const endPos = document.positionAt(match.index + fullMatch.length);
    
    // Encontrar la indentación base de la línea de la etiqueta
    const lineText = document.lineAt(startPos.line).text;
    const indentMatch = lineText.match(/^(\s*)/);
    const baseIndent = indentMatch ? indentMatch[1] : '';
    const attributeIndent = baseIndent + '  '; // 2 espacios para atributos
    
    // Formatear las clases
    const formatted = formatTailwindClasses(
      classContent, 
      baseIndent, 
      attributeIndent, 
      closeQuoteOnNewLine,
      maxLineWidth,
      wrapIndentStyle
    );
    
    // Solo crear un edit si hay cambios en las clases
    if (formatted !== classContent) {
      // Detectar si usa class o className y qué tipo de comillas
      const isClassName = fullMatch.includes('className=');
      const quote = fullMatch.match(/class(?:Name)?=(["'])/)?.[1] || '"';
      const attr = isClassName ? 'className' : 'class';
      
      // Limpiar atributos antes y después (quitar espacios extra)
      const cleanBefore = beforeClass.trim();
      const cleanAfter = afterClass.trim();
      
      // Construir la nueva etiqueta formateada
      let newText = `<${tagName}`;
      
      // Si hay atributos antes de class, añadirlos en nueva línea
      if (cleanBefore) {
        newText += `\n${attributeIndent}${cleanBefore}`;
      }
      
      // Añadir class en nueva línea
      newText += `\n${attributeIndent}${attr}=${quote}${formatted}${quote}`;
      
      // Si hay atributos después de class, añadirlos en nueva línea
      if (cleanAfter) {
        newText += `\n${attributeIndent}${cleanAfter}`;
      }
      
      // Cerrar la etiqueta
      newText += `\n${baseIndent}>`;
      
      edits.push(vscode.TextEdit.replace(
        new vscode.Range(startPos, endPos),
        newText
      ));
    }
  }
  
  return edits;
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Tailwind Class Formatter is now active');

  // Comando manual para formatear
  const formatCommand = vscode.commands.registerCommand('tailwind-formatter.format', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No hay editor activo');
      return;
    }

    console.log('Ejecutando comando de formateo manual...');
    const edits = formatDocument(editor.document);
    console.log(`Se encontraron ${edits.length} ediciones`);
    
    if (edits.length > 0) {
      const workspaceEdit = new vscode.WorkspaceEdit();
      workspaceEdit.set(editor.document.uri, edits);
      vscode.workspace.applyEdit(workspaceEdit).then(success => {
        if (success) {
          vscode.window.showInformationMessage('Clases de Tailwind formateadas');
        }
      });
    } else {
      vscode.window.showInformationMessage('No se encontraron clases para formatear');
    }
  });

  // Formatear al guardar usando DocumentFormattingEditProvider
  const saveListener = vscode.workspace.onWillSaveTextDocument(event => {
    const config = vscode.workspace.getConfiguration('tailwindFormatter');
    const formatOnSave = config.get<boolean>('formatOnSave', true);
    
    if (!formatOnSave) {
      console.log('Formateo al guardar desactivado');
      return;
    }

    console.log('Formateando al guardar...');
    const document = event.document;
    const edits = formatDocument(document);
    
    if (edits.length > 0) {
      console.log(`Aplicando ${edits.length} ediciones al guardar`);
      const workspaceEdit = new vscode.WorkspaceEdit();
      workspaceEdit.set(document.uri, edits);
      event.waitUntil(vscode.workspace.applyEdit(workspaceEdit));
    }
  });

  // Formatear al pegar - Detección mejorada
  let lastChangeTime = 0;
  const pasteListener = vscode.workspace.onDidChangeTextDocument(event => {
    const config = vscode.workspace.getConfiguration('tailwindFormatter');
    const formatOnPaste = config.get<boolean>('formatOnPaste', true);
    
    if (!formatOnPaste || event.contentChanges.length === 0) {
      return;
    }

    // Evitar formatear múltiples veces en rápida sucesión
    const now = Date.now();
    if (now - lastChangeTime < 500) {
      return;
    }
    lastChangeTime = now;

    // Detectar si es un pegado real (no solo Enter o teclas normales)
    // Un pegado típico tiene: un solo cambio grande O múltiples líneas con contenido sustancial
    const isPaste = event.contentChanges.some(change => {
      const text = change.text;
      const lines = text.split('\n');
      
      // Si tiene múltiples líneas, verificar que al menos una tenga contenido sustancial
      if (lines.length > 1) {
        const hasSubstantialContent = lines.some(line => line.trim().length > 15);
        return hasSubstantialContent;
      }
      
      // Si es una sola línea, debe ser bastante larga para considerarse pegado
      return text.length > 50;
    });

    if (isPaste) {
      console.log('Detectado pegado, formateando...');
      setTimeout(() => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document === event.document) {
          const edits = formatDocument(editor.document);
          if (edits.length > 0) {
            console.log(`Aplicando ${edits.length} ediciones después de pegar`);
            const workspaceEdit = new vscode.WorkspaceEdit();
            workspaceEdit.set(editor.document.uri, edits);
            vscode.workspace.applyEdit(workspaceEdit);
          }
        }
      }, 100);
    }
  });

  context.subscriptions.push(formatCommand, saveListener, pasteListener);
}

// Exportar funciones para testing
export {
  classifyTailwindClass,
  getBaseClassName,
  getClassProperty,
  getBreakpoint,
  getBreakpointWeight,
  groupResponsiveClasses,
  formatTailwindClasses,
  formatDocument
};

export function deactivate() {}