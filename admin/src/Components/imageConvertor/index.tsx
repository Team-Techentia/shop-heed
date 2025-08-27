const convertToJPEG = async (image:any) => {
    const watermarks = [
    
      { text: '', x: 300, y: 500 },
      { text: '', x:1200, y: 600 },
    ];
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d') ;
      if (!ctx) {
        reject(new Error('Failed to get 2D context'));
        return;
      }
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0) ;
        ctx.globalAlpha = 0.2; 
  
        // Add watermarks
        ctx.font = 'bold 150px Arial'; 
        ctx.textBaseline = 'middle'; 
        
        watermarks.forEach(({ text, x, y }) => {
          ctx.save();
          ctx.translate(x, y); 
          ctx.rotate(-Math.PI / 4); 
          
         
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; 
          const textWidth = ctx.measureText(text).width;
          ctx.fillRect(-50, -100, textWidth + 100, 200);
  
         
          ctx.fillStyle = 'black'; 
          ctx.fillText(text, 0, 0); 
          
          ctx.restore();
        });
  
      
        ctx.globalAlpha = 1.0;
  
      
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg');
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = URL.createObjectURL(image);
    });
  };
  
  export default convertToJPEG;
  