document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử cần thiết
    const flashlightOverlay = document.getElementById('flashlightOverlay');
    const envelopeBtn = document.getElementById('envelopeBtn');
    const sceneContainer = document.querySelector('.scene-container');
    const videoOverlay = document.getElementById('videoOverlay');
    const birthdayVideo = document.getElementById('birthdayVideo');

    // --- 1. Logic di chuyển đèn pin (Flashlight Movement) ---
    // Lắng nghe sự kiện di chuyển chuột trên toàn bộ tài liệu
    document.addEventListener('mousemove', (e) => {
        // Lấy tọa độ và kích thước của khung cảnh chính
        // Điều này giúp tính toán vị trí chuột chính xác tương đối với khung 1920x1080
        const rect = sceneContainer.getBoundingClientRect();
        
        // Tính toán vị trí chuột (x, y) bên trong khung cảnh
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        // Cập nhật biến CSS trên lớp phủ để di chuyển tâm của mask (lỗ thủng)
        flashlightOverlay.style.setProperty('--mouse-x', x + 'px');
        flashlightOverlay.style.setProperty('--mouse-y', y + 'px');
    });


    // --- 2. Logic khi click vào bức thư ---
    envelopeBtn.addEventListener('click', () => {
        console.log("Envelope clicked!");

        // 1. Làm mờ lớp đèn pin đi trước
        flashlightOverlay.style.opacity = '0';
        
        // 2. Làm mờ cả khung cảnh chính
        sceneContainer.style.transition = 'opacity 0.5s ease';
        sceneContainer.style.opacity = '0';
        
        // Đợi hiệu ứng mờ kết thúc (500ms) rồi mới chuyển cảnh
        setTimeout(() => {
            // Ẩn khung cảnh chính đi
            sceneContainer.style.display = 'none';
            
            // Hiện khung chứa video
            videoOverlay.style.display = 'flex';
            
            // Phát video
            birthdayVideo.currentTime = 0; // Tua về đầu
            birthdayVideo.play().then(() => {
                // Video phát thành công
            }).catch(error => {
                console.error("Autoplay failed:", error);
            });

        }, 500);
    });

    // --- 3. Logic xử lý Video ---
    
    // Khi video kết thúc -> Chuyển sang trang main.html
    birthdayVideo.addEventListener('ended', () => {
        redirectToMain();
    });

    // (Tùy chọn) Click vào video để bỏ qua và chuyển trang ngay
    birthdayVideo.addEventListener('click', () => {
         // Chỉ cho phép bỏ qua nếu video đã chạy được 1 chút (tránh click nhầm lúc mới hiện)
        if (!birthdayVideo.paused && birthdayVideo.currentTime > 0.5) {
            redirectToMain();
        }
    });
    
    // Chặn menu chuột phải trên video
    birthdayVideo.addEventListener('contextmenu', e => e.preventDefault());

    // Hàm chuyển hướng
    function redirectToMain() {
        // Sử dụng location.replace để người dùng không back lại trang intro được
        window.location.replace("main.html");
    }
});