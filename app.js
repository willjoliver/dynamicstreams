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
// JavaScript Implementation
let isCinematicMode = false;
let mainStreamIndex = 0;

document.getElementById('cinemaMode').addEventListener('click', () => {
  const container = document.getElementById('streamsContainer');
  isCinematicMode = !isCinematicMode;
  
  if(isCinematicMode) {
    container.classList.add('cinematic-mode');
    activateCinematicLayout();
    this.classList.add('active-mode');
    this.textContent = '⬜ Grid View';
  } else {
    container.classList.remove('cinematic-mode');
    this.classList.remove('active-mode');
    this.textContent = '🎬 Cinematic';
  }
});

function activateCinematicLayout() {
  const streams = Array.from(document.querySelectorAll('.iframe-wrapper'));
  if(streams.length < 1) return;

  // Create container structure
  const mainStream = streams[0].cloneNode(true);
  const rowWrapper = document.createElement('div');
  rowWrapper.className = 'stream-row';

  // Add remaining streams to row
  streams.slice(1).forEach(stream => {
    const clone = stream.cloneNode(true);
    clone.addEventListener('click', promoteToMain);
    rowWrapper.appendChild(clone);
  });

  // Clear and rebuild
  streamsContainer.innerHTML = '';
  mainStream.className = 'iframe-wrapper main-stream';
  streamsContainer.appendChild(mainStream);
  streamsContainer.appendChild(rowWrapper);
}

function promoteToMain(e) {
  const currentMain = document.querySelector('.main-stream');
  const newMain = e.currentTarget.cloneNode(true);
  
  // Swap positions
  const rowWrapper = document.querySelector('.stream-row');
  rowWrapper.insertBefore(currentMain, e.currentTarget);
  e.currentTarget.replaceWith(newMain);
  
  newMain.className = 'iframe-wrapper main-stream';
  currentMain.className = 'iframe-wrapper';
  currentMain.addEventListener('click', promoteToMain);
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
  // Ensure the clicked element is a channel
  const channelElement = event.target.closest('.channel, .channel-item');
  if (!channelElement) return;

  const inputs = document.querySelectorAll("input[type='text']");
  const channelId = event.target.dataset.channelId;
  const isAltFormat = event.target.classList.contains('alt-channel');

  for (let input of inputs) {
    if (input.value.trim() === "") {
      // Use alternate URL format for channels2
      if (isAltFormat) {
        input.value = `https://daddylive.mp/stream/bet.php?id=${channelId}`;
      } else {
        input.value = channelId; // Standard format
      }
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
    if (e.ctrlKey) {
      if (e.key >= '1' && e.key <= '6') {
        document.getElementById(`streamInput${e.key}`).focus();
      } else if (e.key === 'Enter') {
        updateStreams();
      } else if (e.key === 'Backspace') {
        clearStreams();
      }
    }
  });

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
    console.log("Schedule Data:", scheduleData);
    displaySchedule(scheduleData);
  } catch (error) {
    console.error("Error loading schedule:", error);
    document.getElementById("scheduleContainer").textContent = "Failed to load schedule";
  }
}

// Populate the channel list sidebar
function populateChannelList() {
  const container = document.getElementById('channelList');
  if (!channels) return;

  channels.forEach(channel => {
    const div = document.createElement('div');
    div.className = 'channel-item';
    div.textContent = `${channel.id} ${channel.name}`;
    div.dataset.channelId = channel.id; // Correct attribute
    container.appendChild(div);
  });
}

// Display the schedule data
function displaySchedule(scheduleData) {
  const container = document.getElementById("scheduleContainer");
  container.innerHTML = "";

  try {
    Object.entries(scheduleData).forEach(([dateString, categories]) => {
      // Clean up date string
      const cleanDate = dateString.replace(' - Schedule Time UK GMT', '');
      const dateHeader = document.createElement("h2");
      dateHeader.className = "schedule-date";
      dateHeader.textContent = cleanDate;
      container.appendChild(dateHeader);

      Object.entries(categories).forEach(([categoryName, events]) => {
        // Clean up category name
        const cleanCategory = categoryName.replace('</span>', '');

        // Skip empty or tennis categories
        if (!events || cleanCategory.toLowerCase().includes('tennis')) return;

        // Filter out invalid events
        const filteredEvents = events.filter(event => 
          event.event && !event.event.toLowerCase().includes('tennis')
        );
        if (filteredEvents.length === 0) return;

        // Create category container
        const categoryContainer = document.createElement("div");
        const categoryHeader = document.createElement("div");
        const eventsContainer = document.createElement("div");

        // Category header setup
        categoryHeader.className = "category-header";
        categoryHeader.innerHTML = `
          <span>${cleanCategory}</span>
          <span>▶</span>
        `;

        // Events container setup
        eventsContainer.className = "category-events collapsed";

        // Toggle functionality
        categoryHeader.addEventListener("click", () => {
          eventsContainer.classList.toggle("collapsed");
          categoryHeader.querySelector("span:last-child").textContent = 
            eventsContainer.classList.contains("collapsed") ? "▶" : "▼";
        });

filteredEvents.forEach(event => {
  console.log("Event Data:", event);
  const eventDiv = document.createElement("div");
  eventDiv.className = "event";
  const localTime = convertGMTToLocal(event.time, dateString);

  // Ensure channels properties exist
  const channels = Array.isArray(event.channels) ? event.channels : [];
  const channels2 = Array.isArray(event.channels2) ? event.channels2 : [];

  eventDiv.innerHTML = `
    <h3>${localTime} - ${event.event}</h3>
    ${renderChannels(channels, channels2)}
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
function renderChannels(channels, channels2) {
  try {
    // Ensure channels are always arrays
    const safeChannels = Array.isArray(channels) ? channels : [];
    const safeChannels2 = Array.isArray(channels2) ? channels2 : [];

    const mainChannels = safeChannels.map(channel => `
      <div class="channel" data-channel-id="${channel.channel_id}">
        ${channel.channel_name}
      </div>
    `).join('');

    const altChannels = safeChannels2.map(channel => `
      <div class="channel alt-channel" data-channel-id="${channel.channel_id}">
        ${channel.channel_name}
      </div>
    `).join('');

    return `
      <div class="channel-group">
        ${mainChannels}
        ${altChannels}
      </div>
    `;
  } catch (e) {
    console.error('Channel rendering error:', e);
    return ''; // Return empty string if rendering fails
  }
}

// Update the streams grid with embedded iframes
function updateStreams() {
  try {
    const streamsContainer = document.getElementById('streamsContainer');
    streamsContainer.innerHTML = '';
    let streamCount = 0;

    for (let i = 1; i <= 6; i++) {
      const input = document.getElementById(`streamInput${i}`);
      const streamId = input.value.trim();

      if (streamId) {
        streamCount++;
        const channel = channels.find(ch => ch.id == streamId);
        const wrapper = document.createElement('div');
        wrapper.className = 'iframe-wrapper';

        // Determine the stream URL
        let streamUrl;
        if (streamId.startsWith('https://')) {
          streamUrl = streamId; // Use full URL for channels2
        } else {
          streamUrl = channel?.customUrl || `https://daddylive.mp/embed/stream-${streamId}.php`;
        }

        wrapper.innerHTML = `<iframe src="${streamUrl}" allowfullscreen></iframe>`;
        streamsContainer.appendChild(wrapper);
      }
    }

    // Update grid layout based on stream count
    streamsContainer.setAttribute('data-stream-count', streamCount);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    streamsContainer.style.gridTemplateColumns = isMobile ? '1fr' : '';
  } catch (e) {
    console.error("Error updating streams:", e);
  }
}

// Clear all stream inputs and iframes
function clearStreams() {
  for (let i = 1; i <= 6; i++) {
    document.getElementById(`streamInput${i}`).value = '';
  }
  const streamsContainer = document.getElementById('streamsContainer');
  streamsContainer.innerHTML = '';
  streamsContainer.classList.remove('custom-layout');
}
