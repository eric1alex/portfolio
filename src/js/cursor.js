// Custom Cursor Implementation
const initCursor = () => {
    // Only run on homepage
    const isHomepage = window.location.pathname === '/' || 
                       window.location.pathname === '/index.html' || 
                       window.location.pathname.endsWith('/index.html') ||
                       document.getElementById('slideshow-container');
    
    if (!isHomepage) return;

    // Prevent double initialization
    if (document.querySelector('.custom-cursor')) return;

    document.body.classList.add('has-custom-cursor');
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const follower = document.createElement('div');
    follower.className = 'custom-cursor-follower';
    document.body.appendChild(follower);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    let hasMoved = false;

    // Initially hide until first movement
    cursor.style.opacity = '0';
    follower.style.opacity = '0';

    document.addEventListener('mousemove', (e) => {
        if (!hasMoved) {
            hasMoved = true;
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
            // Snap to initial position to avoid sliding from (0,0)
            cursorX = followerX = mouseX = e.clientX;
            cursorY = followerY = mouseY = e.clientY;
        }
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth animation loop
    function animate() {
        // Smoothly move cursor
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        // Smoothly move follower with more lag
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;

        requestAnimationFrame(animate);
    }
    animate();

    // Hover effect using event delegation for better performance and dynamic elements
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .group, [role="button"]');
        if (target) {
            document.body.classList.add('cursor-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('a, button, .group, [role="button"]');
        if (target) {
            document.body.classList.remove('cursor-hover');
        }
    });

    // Handle clicks
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        follower.style.transform = 'translate(-50%, -50%) scale(1.2)';
    });
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Hide/Show cursor when leaving/entering window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        if (hasMoved) {
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
        }
    });
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
} else {
    initCursor();
}

