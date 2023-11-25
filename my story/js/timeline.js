document.addEventListener('DOMContentLoaded', function () {
    // Select all timeline circles
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Add click event listener to each timeline circle
    timelineItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Remove 'active' class from all circles
            timelineItems.forEach((item) => {
                item.classList.remove('active');
            });

            // Add 'active' class to the clicked circle
            item.classList.add('active');

            // Load corresponding HTML file based on the circle clicked
            loadHTMLFile(index + 1); // Add 1 to index because your timeline starts from 1
        });
    });

    // Function to load HTML file based on circle index
    function loadHTMLFile(index) {
        // Define the HTML file names corresponding to each circle
        const htmlFiles = [
            './mystory1.html', // Adjust the file names as needed
            './mystory2.html',
            './mystory3.html',
            './mystory4.html',
            './mystory5.html'
        ];

        // Check if the index is valid
        if (index >= 1 && index <= htmlFiles.length) {
            const fileName = htmlFiles[index - 1];

            // Navigate to the new HTML file
            window.location.href = fileName;
        } else {
            console.error('Invalid index:', index);
        }
    }
});
