function convertGMTToLocal(timeString, dateString) {
  try {
    // Clean up date string
    const cleanDate = dateString
      .replace(' - Schedule Time UK GMT', '')
      .replace(/(\d+)(st|nd|rd|th)/, '$1');

    // Parse as GMT date
    const gmtDateString = `${cleanDate} ${timeString} GMT`;
    const date = new Date(gmtDateString);

    // Format with timezone
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  } catch (e) {
    console.error('Time conversion error:', e);
    return timeString;
  }
}

// Toggle schedule sidebar
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

// Toggle channel sidebar
function toggleChannelSidebar() {
  document.getElementById("channelSidebar").classList.toggle("open");
}

function fillEmptyStream(event) {
  // Ensure the clicked element is a channel or channel-item
  const channelElement = event.target.closest('.channel, .channel-item');
  if (!channelElement) return;

  const channelId = channelElement.dataset.channelId;
  const inputs = document.querySelectorAll("input[type='text']");

  for (let input of inputs) {
    if (input.value.trim() === "") {
      input.value = channelId; // Set the standard channel ID
      input.focus(); // Focus the filled input
      break;
    }
  }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('toggleSchedule').addEventListener('click', toggleSidebar);
  document.getElementById('closeSidebar').addEventListener('click', toggleSidebar);
  document.getElementById('toggleChannels').addEventListener('click', toggleChannelSidebar);
  document.getElementById('closeChannels').addEventListener('click', toggleChannelSidebar);
  document.getElementById('updateStreams').addEventListener('click', updateStreams);
  document.getElementById('clearStreams').addEventListener('click', clearStreams);
  document.getElementById('scheduleContainer').addEventListener('click', fillEmptyStream);
  document.getElementById('channelList').addEventListener('click', fillEmptyStream);

  // Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // If we're in an input field, trigger updateStreams on Enter.
  if (e.target.tagName.toLowerCase() === 'input') {
    if (e.key === 'Enter') {
      updateStreams();
      e.preventDefault();
      return; // Prevent further processing
    }
  }
  
  // Global shortcuts when the Command key (metaKey) is held (for Mac)
  if (e.metaKey) {
    if (e.key >= '1' && e.key <= '9') {
      document.getElementById(`streamInput${e.key}`).focus();
    } else if (e.key === 'Enter') {
      updateStreams();
    } else if (e.key === 'Backspace') {
      clearStreams();
    }
  }
});
  // When the sort option changes, repopulate the channel list.
  const sortSelect = document.getElementById('sortOrder');
  if (sortSelect) {
    sortSelect.addEventListener('change', populateChannelList);
  }

  populateChannelList();
  loadSchedule();
});

// Load schedule data from GitHub
async function loadSchedule() {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/willjoliver/dynamicstreams/refs/heads/main/schedule.json'
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const scheduleData = await response.json();
    displaySchedule(scheduleData);
  } catch (error) {
    console.error("Error loading schedule:", error);
    document.getElementById("scheduleContainer").textContent = "Failed to load schedule";
  }
}

// Populate the channel list sidebar with sorting options.
function populateChannelList() {
  const container = document.getElementById('channelList');
  container.innerHTML = ''; // Clear previous content
  if (!channels) return;

  // Get the sort order from the select element
  const sortSelect = document.getElementById('sortOrder');
  let sortedChannels = channels.slice(); // Create a shallow copy

  if (sortSelect) {
    const sortOrder = sortSelect.value;
    if (sortOrder === 'alpha') {
      // Sort alphabetically by channel name.
      sortedChannels.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'numeric') {
      // Sort numerically by channel id.
      sortedChannels.sort((a, b) => Number(a.id) - Number(b.id));
    }
  }

  // Render channels
  sortedChannels.forEach(channel => {
    const div = document.createElement('div');
    div.className = 'channel-item';
    div.textContent = `${channel.id} ${channel.name}`;
    div.dataset.channelId = channel.id;
    container.appendChild(div);
  });
}

// Display the schedule data
function displaySchedule(scheduleData) {
  const container = document.getElementById("scheduleContainer");
  container.innerHTML = "";

  try {
    // 1. Sort dates chronologically
    const sortedDates = Object.entries(scheduleData).sort((a, b) => {
      const dateA = new Date(a[0].replace(' - Schedule Time UK GMT', ''));
      const dateB = new Date(b[0].replace(' - Schedule Time UK GMT', ''));
      return dateA - dateB;
    });

    sortedDates.forEach(([dateString, categories]) => {
      const cleanDate = dateString.replace(' - Schedule Time UK GMT', '');
      const dateHeader = document.createElement("h2");
      dateHeader.className = "schedule-date";
      dateHeader.textContent = cleanDate;
      container.appendChild(dateHeader);

      // 2. Collect and sort ALL events across categories
      const allEvents = [];
      Object.entries(categories).forEach(([categoryName, events]) => {
        const cleanCategory = categoryName.replace('</span>', '');
        const disallowedKeywords = [
          'tennis', 'golf', 'snooker', 'biathlon', 'cross country', 'cycling',
          'futsal', 'handball', 'horse racing', 'ski jumping', 'squash',
          'volleyball', 'water polo', 'winter sports', 'athletics', 'aussie rules',
          'darts', 'rugby league', 'rugby union', 'ice skating', 'alpine ski'
        ];

        if (!events || disallowedKeywords.some(k => cleanCategory.toLowerCase().includes(k.toLowerCase()))) {
          return;
        }

        events.forEach(event => {
          if (event.event && !disallowedKeywords.some(k => event.event.toLowerCase().includes(k.toLowerCase()))) {
            const eventTime = new Date(`${cleanDate} ${event.time} GMT`);
            allEvents.push({
              ...event,
              category: cleanCategory,
              sortKey: eventTime.getTime()
            });
          }
        });
      });

      // 3. Sort all events chronologically
      allEvents.sort((a, b) => a.sortKey - b.sortKey);

      // 4. Group sorted events by category
      const eventsByCategory = allEvents.reduce((acc, event) => {
        acc[event.category] = acc[event.category] || [];
        acc[event.category].push(event);
        return acc;
      }, {});

      // 5. Sort categories by their earliest event
      const sortedCategories = Object.entries(eventsByCategory).sort((a, b) => {
        return a[1][0].sortKey - b[1][0].sortKey;
      });

      // 6. Render categories with sorted events
      sortedCategories.forEach(([categoryName, events]) => {
        const categoryContainer = document.createElement("div");
        const categoryHeader = document.createElement("div");
        const eventsContainer = document.createElement("div");

        categoryHeader.className = "category-header";
        categoryHeader.innerHTML = `<span>${categoryName}</span><span>▶</span>`;
        
        // Initialize events container as collapsed
        eventsContainer.className = "category-events collapsed";

        // Toggle functionality
        categoryHeader.addEventListener("click", () => {
          eventsContainer.classList.toggle("collapsed");
          categoryHeader.querySelector("span:last-child").textContent = 
            eventsContainer.classList.contains("collapsed") ? "▶" : "▼";
        });

        events.forEach(event => {
          const eventDiv = document.createElement("div");
          eventDiv.className = "event";
          const localTime = convertGMTToLocal(event.time, dateString);
          
          eventDiv.innerHTML = `
            <h3>${localTime} - ${event.event}</h3>
            ${renderChannels(event.channels || [])}
          `;
          eventsContainer.appendChild(eventDiv);
        });

        categoryContainer.appendChild(categoryHeader);
        categoryContainer.appendChild(eventsContainer);
        container.appendChild(categoryContainer);
      });
    });
  } catch (e) {
    console.error("Schedule display error:", e);
    container.textContent = "Error displaying schedule data";
  }
}

function renderChannels(channels) {
  try {
    const safeChannels = Array.isArray(channels) ? channels : [];
    const mainChannels = safeChannels.map(channel => `
      <div class="channel" data-channel-id="${channel.channel_id}">
        ${channel.channel_name}
      </div>
    `).join('');
    return `<div class="channel-group">${mainChannels}</div>`;
  } catch (e) {
    console.error('Channel rendering error:', e);
    return '';
  }
}

function isValidChannel(channelId) {
  const idNumber = parseInt(channelId, 10);
  if (!isNaN(idNumber)) {
    if (idNumber >= 501 && idNumber <= 520) {
      alert('This channel is blocked due to content restrictions');
      return false;
    }
  }
  return true;
}

function updateStreams() {
  try {
    const streamsContainer = document.getElementById('streamsContainer');
    streamsContainer.innerHTML = '';
    let streamCount = 0;

    for (let i = 1; i <= 9; i++) {
      const input = document.getElementById(`streamInput${i}`);
      const streamId = input.value.trim();

      if (streamId) {
        if (!isValidChannel(streamId)) {
          input.value = ''; // Clear the blocked channel input
          continue; // Skip to next iteration
        }
        
        streamCount++;
        const channel = channels.find(ch => ch.id == streamId);
        const wrapper = document.createElement('div');
        wrapper.className = 'iframe-wrapper';

        // Determine the stream URL
        let streamUrl;
        if (streamId.startsWith('https://')) {
          streamUrl = streamId;
        } else {
          streamUrl = channel?.customUrl || `https://daddylive.mp/embed/stream-${streamId}.php`;
        }

        wrapper.innerHTML = `<iframe src="${streamUrl}" allowfullscreen></iframe>`;
        streamsContainer.appendChild(wrapper);
      }
    }

    // Update grid layout based on stream count
    streamsContainer.setAttribute('data-stream-count', streamCount);
  } catch (e) {
    console.error("Error updating streams:", e);
  }
}

// Clear all stream inputs and iframes
function clearStreams() {
  for (let i = 1; i <= 9; i++) {
    document.getElementById(`streamInput${i}`).value = '';
  }
  const streamsContainer = document.getElementById('streamsContainer');
  streamsContainer.innerHTML = '';
  streamsContainer.classList.remove('custom-layout');
}
