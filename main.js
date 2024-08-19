const dropZone = document.getElementById('dropZone');
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const fileInfo = document.getElementById('fileInfo');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const formatSelect = document.getElementById('formatSelect');
const convertBtn = document.getElementById('convertBtn');

let originalImage = null;

dropZone.addEventListener('click', () => imageInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.backgroundColor = 'rgba(241, 196, 15, 0.2)';
});

dropZone.addEventListener('dragleave', () => {
  dropZone.style.backgroundColor = 'rgba(241, 196, 15, 0.1)';
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.style.backgroundColor = 'rgba(241, 196, 15, 0.1)';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    handleImage(file);
  }
});

imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    handleImage(file);
  }
});

function handleImage(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    preview.src = event.target.result;
    preview.style.display = 'block';
    originalImage = new Image();
    originalImage.onload = () => {
      widthInput.value = originalImage.width;
      heightInput.value = originalImage.height;
      updateFileInfo(file);
    };
    originalImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function updateFileInfo(file) {
  const sizeInKB = (file.size / 1024).toFixed(2);
  const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
  fileInfo.innerHTML = `
    <strong>Name:</strong> ${file.name}<br>
    <strong>Type:</strong> ${file.type}<br>
    <strong>Size:</strong> ${sizeInKB} KB (${sizeInMB} MB)<br>
    <strong>Dimensions:</strong> ${originalImage.width}x${originalImage.height}
  `;
  fileInfo.style.display = 'block';
}

convertBtn.addEventListener('click', () => {
  if (!originalImage) {
    alert('Please select an image first.');
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const newWidth = parseInt(widthInput.value) || originalImage.width;
  const newHeight = parseInt(heightInput.value) || originalImage.height;
  canvas.width = newWidth;
  canvas.height = newHeight;
  ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);

  const format = formatSelect.value;
  let mimeType;
  let fileName;

  switch (format) {
    case 'png':
      mimeType = 'image/png';
      fileName = 'converted_image.png';
      break;
    case 'jpeg':
      mimeType = 'image/jpeg';
      fileName = 'converted_image.jpg';
      break;
    case 'webp':
      mimeType = 'image/webp';
      fileName = 'converted_image.webp';
      break;
  }

  canvas.toBlob((blob) => {
    saveAs(blob, fileName);
  }, mimeType);
});

// Maintain aspect ratio
widthInput.addEventListener('input', () => {
  if (originalImage) {
    const aspectRatio = originalImage.width / originalImage.height;
    heightInput.value = Math.round(widthInput.value / aspectRatio);
  }
});

heightInput.addEventListener('input', () => {
  if (originalImage) {
    const aspectRatio = originalImage.width / originalImage.height;
    widthInput.value = Math.round(heightInput.value * aspectRatio);
  }
});
