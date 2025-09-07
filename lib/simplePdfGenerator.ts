// 簡化版 PDF 生成器 - 使用瀏覽器內建列印功能
export const generateSimplePDF = (element: HTMLElement, filename: string = 'resume.pdf'): void => {
  // 創建新的視窗
  const printWindow = window.open('', '_blank')
  
  if (!printWindow) {
    alert('無法開啟列印視窗，請檢查瀏覽器設定')
    return
  }

  // 獲取元素的 HTML 內容
  const elementHTML = element.outerHTML
  
  // 創建完整的 HTML 文檔
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${filename}</title>
      <style>
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .resume-preview {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
        body {
          margin: 0;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .resume-preview {
          max-width: 100%;
          margin: 0 auto;
        }
      </style>
    </head>
    <body>
      ${elementHTML}
      <script>
        // 自動觸發列印
        window.onload = function() {
          window.print();
          // 列印後關閉視窗
          setTimeout(() => {
            window.close();
          }, 1000);
        };
      </script>
    </body>
    </html>
  `

  // 寫入內容到新視窗
  printWindow.document.write(htmlContent)
  printWindow.document.close()
}

// 使用 File System Access API 的現代化 PDF 生成
export const generateModernPDF = async (element: HTMLElement, filename: string = 'resume.pdf'): Promise<void> => {
  try {
    // 檢查瀏覽器是否支持 File System Access API
    if ('showSaveFilePicker' in window) {
      const printWindow = window.open('', '_blank')
      
      if (!printWindow) {
        throw new Error('無法開啟列印視窗')
      }

      const elementHTML = element.outerHTML
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${filename}</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 1cm;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              }
              .resume-preview {
                box-shadow: none !important;
                border: none !important;
                margin: 0 !important;
                padding: 0 !important;
              }
            }
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .resume-preview {
              max-width: 100%;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          ${elementHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => {
                window.close();
              }, 1000);
            };
          </script>
        </body>
        </html>
      `

      printWindow.document.write(htmlContent)
      printWindow.document.close()
    } else {
      // 降級到基本列印功能
      generateSimplePDF(element, filename)
    }
  } catch (error) {
    console.error('PDF generation error:', error)
    // 降級到基本列印功能
    generateSimplePDF(element, filename)
  }
}
