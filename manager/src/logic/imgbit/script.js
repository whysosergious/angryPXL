// scale and decrease size of images with js canvas

const defaultOptions = {
  img_grade: .72, // .72 is highest quality
  keep_asra: true,  // keep aspect ratio
  keep_type: false, // keep original file type
  default_type: 'image/jpeg',
  target_sizes: [1000, 700, 400], // new dimentions, scale copies to these sizes. if it's width or height depends on the aspect ratio
}

let galleryAlbum = 'featured';

const imgbit = async (images,  options=defaultOptions ) => {
  const { img_grade, keep_type, default_type, target_sizes } = options;

  // return only when all promises are done
  return Promise.all(Object.values(images).map(image => {

    return new Promise(resolve => {
        
      let reader = new FileReader();
      reader.readAsDataURL(image);

      reader.onload = function() {
        let url = this.result;
        let imageData = {}

        // store image data
        let lastIndex = image.name.lastIndexOf('.');
        [ imageData.file_name, imageData.file_ext ] = [ image.name.substr(0, lastIndex), image.name.substr(lastIndex) ];
        imageData.url = url;
        imageData.file_type = image.type;
        imageData.file_size = image.size;
        imageData.album = galleryAlbum;
        imageData.description = 'Preview';

        let img = new Image();
        img.src = url;        

        img.addEventListener('load', () => {

          imageData.height = img.height;
          imageData.width = img.width;
          imageData.asra = imageData.height / imageData.width;

          // define dominant dimension
          let scaleDim = imageData.asra < 1 ? 'height' : 'width';
          
          // create optimized image sizes
          imageData.sizes = target_sizes.reduce(function(result, targetSize) {
            
            // do not scale up the image and skip if the difference is less than 101 dalmatians
            if ( imageData[scaleDim] > targetSize+100 ) {

              let scaleAmount = imageData[scaleDim] - targetSize;
              let canvas = document.createElement('canvas');

              canvas.height = imageData.height - scaleAmount;
              canvas.width = imageData.width - scaleAmount;

              let context = canvas.getContext('2d');
              context.drawImage(img, 0, 0, canvas.width, canvas.height);

              let dataURL = canvas.toDataURL(keep_type ? imageData.file_type : default_type, img_grade);

              result.push({
                url: dataURL,
                file_name: `${ imageData.file_name }-${ targetSize }w`,
                file_ext: imageData.file_ext,
                file_size: Math.floor(dataURL.length),
                height: canvas.height,
                width: canvas.width,
              });
            }
            return result;
          }, []);
          
          resolve(imageData);

        }, { passive: true, once: true });
      }
    });
  }));
}

export default imgbit;