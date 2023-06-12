function changeTab(event, tabId) {
    // Get all tab content elements
    var tabContents = document.getElementsByClassName("tab-content");
    
    // Hide all tab content elements
    for (var i = 0; i < tabContents.length; i++) {
      tabContents[i].style.display = "none";
    }
    
    // Get all tab elements
    var tabs = document.getElementsByClassName("tab");
    
    // Remove "active" class from all tab elements
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("active");
    }
    
    // Show the selected tab content
    document.getElementById(tabId).style.display = "block";
    
    // Add "active" class to the clicked tab
    event.currentTarget.classList.add("active");
  }

// Add event listener to the dropdown content links
var dropdownLinks = document.querySelectorAll('.dropdown-content a');
dropdownLinks.forEach(function(link) {
  link.addEventListener('click', function() {
    var selectedValue = this.getAttribute('data-value');
    var dropdownText = document.getElementById('dropdown-text');
    var dropdownContent = document.querySelector('.dropdown-content');

    // Update the dropdown text with the selected value
    dropdownText.textContent = this.textContent;

    // Show the dropdown content after selection
    dropdownContent.style.display = 'none';
  });
});

// Add event listener to the dropdown button
var dropdownBtn = document.querySelector('.dropbtn');
dropdownBtn.addEventListener('mouseover', function() {
  var dropdownContent = document.querySelector('.dropdown-content');

  // Toggle the display of the dropdown content
  if (dropdownContent.style.display === 'none') {
    dropdownContent.style.display = 'block';
  } else {
    dropdownContent.style.display = 'none';
  }
});

// Add event listener to hide the dropdown content when clicking outside the dropdown
document.addEventListener('click', function(event) {
  var dropdownContent = document.querySelector('.dropdown-content');

  if (!event.target.closest('.dropdown')) {
    dropdownContent.style.display = 'none';
  }
});
