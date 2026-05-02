import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AnalysisResult } from '../types';

export const exportToPDF = (result: AnalysisResult) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(139, 92, 246); // Primary color
  doc.text('FirstStep Analysis Report', margin, yPosition);
  yPosition += 10;

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date(result.timestamp).toLocaleString()}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Language: ${result.language}`, margin, yPosition);
  yPosition += 15;

  // Summary Section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Summary', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const summaryLines = doc.splitTextToSize(result.summary, pageWidth - 2 * margin);
  doc.text(summaryLines, margin, yPosition);
  yPosition += summaryLines.length * 5 + 10;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Components Section
  if (result.components.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Components', margin, yPosition);
    yPosition += 10;

    const componentData = result.components.map(comp => [
      comp.name,
      comp.type,
      comp.complexity,
      comp.dependencies.join(', ') || 'None'
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Name', 'Type', 'Complexity', 'Dependencies']],
      body: componentData,
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246] },
      margin: { left: margin, right: margin },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Tests Section
  if (result.tests.length > 0) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Test Suggestions', margin, yPosition);
    yPosition += 10;

    result.tests.forEach((test, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${test.testName}`, margin, yPosition);
      yPosition += 6;

      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(test.description, pageWidth - 2 * margin);
      doc.text(descLines, margin + 5, yPosition);
      yPosition += descLines.length * 4 + 5;

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Priority: ${test.priority}`, margin + 5, yPosition);
      yPosition += 8;
    });
  }

  // Documentation Section
  if (result.documentation) {
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Documentation', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const docLines = doc.splitTextToSize(result.documentation, pageWidth - 2 * margin);
    doc.text(docLines, margin, yPosition);
  }

  // Save the PDF
  doc.save(`firststep-analysis-${new Date().getTime()}.pdf`);
};

export const exportToMarkdown = (result: AnalysisResult) => {
  let markdown = `# FirstStep Analysis Report\n\n`;
  markdown += `**Generated:** ${new Date(result.timestamp).toLocaleString()}\n`;
  markdown += `**Language:** ${result.language}\n\n`;
  markdown += `---\n\n`;

  // Summary
  markdown += `## Summary\n\n`;
  markdown += `${result.summary}\n\n`;

  // Components
  if (result.components.length > 0) {
    markdown += `## Components\n\n`;
    result.components.forEach((comp, index) => {
      markdown += `### ${index + 1}. ${comp.name}\n\n`;
      markdown += `- **Type:** ${comp.type}\n`;
      markdown += `- **Complexity:** ${comp.complexity}\n`;
      markdown += `- **Description:** ${comp.description}\n`;
      if (comp.dependencies.length > 0) {
        markdown += `- **Dependencies:** ${comp.dependencies.join(', ')}\n`;
      }
      markdown += `\n`;
    });
  }

  // Tests
  if (result.tests.length > 0) {
    markdown += `## Test Suggestions\n\n`;
    result.tests.forEach((test, index) => {
      markdown += `### ${index + 1}. ${test.testName}\n\n`;
      markdown += `**Priority:** ${test.priority}\n\n`;
      markdown += `${test.description}\n\n`;
      markdown += `\`\`\`${result.language}\n${test.code}\n\`\`\`\n\n`;
    });
  }

  // Documentation
  if (result.documentation) {
    markdown += `## Documentation\n\n`;
    markdown += `\`\`\`\n${result.documentation}\n\`\`\`\n\n`;
  }

  // Original Code
  markdown += `## Original Code\n\n`;
  markdown += `\`\`\`${result.language}\n${result.code}\n\`\`\`\n`;

  // Create and download the file
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `firststep-analysis-${new Date().getTime()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Made with Bob
