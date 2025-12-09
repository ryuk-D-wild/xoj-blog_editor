const writeTab = document.getElementById('write-tab');
const viewTab = document.getElementById('view-tab');
const writeSection = document.getElementById('write-section');
const viewSection = document.getElementById('view-section');
const blogForm = document.getElementById('blog-form');
const blogList = document.getElementById('blog-list');
const toast = document.getElementById('toast');

// Tab Switching
writeTab.addEventListener('click', () => {
    switchTab('write');
});

viewTab.addEventListener('click', () => {
    switchTab('view');
    fetchBlogs();
});

function switchTab(tab) {
    if (tab === 'write') {
        writeTab.classList.add('active');
        viewTab.classList.remove('active');
        writeSection.classList.add('active-section');
        viewSection.classList.remove('active-section');
    } else {
        viewTab.classList.add('active');
        writeTab.classList.remove('active');
        viewSection.classList.add('active-section');
        writeSection.classList.remove('active-section');
    }
}

// Create Blog
blogForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const submitBtn = document.getElementById('publish-btn');

    try {
        submitBtn.textContent = 'Publishing...';
        submitBtn.disabled = true;

        const response = await fetch('/api/blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
            showToast('Post published successfully!');
            blogForm.reset();
            // Optional: switch to view tab
            // switchTab('view');
            // fetchBlogs();
        } else {
            showToast('Failed to publish post', true);
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('An error occurred', true);
    } finally {
        submitBtn.textContent = 'Publish Post';
        submitBtn.disabled = false;
    }
});

// Fetch Blogs
async function fetchBlogs() {
    try {
        blogList.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">Loading...</p>';

        const response = await fetch('/api/blogs');
        const blogs = await response.json();

        if (blogs.length === 0) {
            blogList.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No posts yet. Write something!</p>';
            return;
        }

        blogList.innerHTML = blogs.map(blog => `
            <article class="blog-card">
                <h3>${escapeHtml(blog.title)}</h3>
                <span class="blog-date">${new Date(blog.createdAt).toLocaleDateString()}</span>
                <div class="blog-preview">${escapeHtml(blog.content)}</div>
            </article>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
        blogList.innerHTML = '<p style="color: #ef4444; text-align: center;">Failed to load blogs.</p>';
    }
}

// Utility
function showToast(message, isError = false) {
    toast.textContent = message;
    toast.style.backgroundColor = isError ? '#ef4444' : '#10b981';
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
