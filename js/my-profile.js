document.addEventListener("DOMContentLoaded", () => {
 
  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    document.getElementById("profileImage").src = savedImage;
  }
  document.getElementById("profileImageInput").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageData = e.target.result;
        localStorage.setItem("profileImage", imageData);
        document.getElementById("profileImage").src = imageData;
      };
      reader.readAsDataURL(file);
    }
  });
});
