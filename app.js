function convertGMTToLocal(timeString, dateString) {
  try {
    // Better date string cleanup
    const cleanDateString = dateString
      .replace(/(\d+)(st|nd|rd|th)/, '$1')
      .replace(/,/, '');
    
    // More reliable date parsing
    const dateParts = cleanDateString.split(/\s+/);
    const [dayName, month, day, year] = dateParts;
    
    // Use UTC to avoid timezone issues
    const isoDate = new Date(Date.UTC(
      year,
      new Date(Date.parse(month + " 1, " + year)).getMonth(),
      day,
      ...timeString.split(':').map(Number)
    ));

    return isoDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    console.error('Time conversion error:', e);
    return timeString;
  }
}
    
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}
    
function toggleChannelSidebar() {
  document.getElementById("channelSidebar").classList.toggle("open");
}
    
function fillEmptyStream(event) {
  const inputs = document.querySelectorAll("input[type='text']");
  const channelId = event.target.dataset.channelId;
  const isAltFormat = event.target.dataset.altFormat === "true";

  for (let input of inputs) {
    if (input.value.trim() === "") {
      // Use alternate URL format for channels2
      if (isAltFormat) {
        input.value = `https://daddylive.mp/stream/bet.php?id=${channelId}`;
      } else {
        input.value = channelId; // Standard format
      }
      break;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('toggleSchedule').addEventListener('click', toggleSidebar);
  document.getElementById('closeSidebar').addEventListener('click', toggleSidebar);
  document.getElementById('toggleChannels').addEventListener('click', toggleChannelSidebar);
  document.getElementById('closeChannels').addEventListener('click', toggleChannelSidebar);
  document.getElementById('updateStreams').addEventListener('click', updateStreams);
  document.getElementById('clearStreams').addEventListener('click', clearStreams);
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

function populateChannelList() {
  const container = document.getElementById('channelList');
  if (!channels) {
    console.error("Channels data not loaded or is undefined");
    return;
  }
  channels.forEach(channel => {
    const div = document.createElement('div');
    div.className = 'channel-item';
    div.textContent = `${channel.id} ${channel.name}`;
    div.dataset.channelId = channel.id;
    div.addEventListener('click', fillEmptyStream);
    container.appendChild(div);
  });
}

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

        // Populate events
        filteredEvents.forEach(event => {
          const eventDiv = document.createElement("div");
          eventDiv.className = "event";
          const localTime = convertGMTToLocal(event.time, dateString);

          // Event details
          eventDiv.innerHTML = `
            <h3>${localTime} - ${event.event}</h3>
            ${renderChannels(event.channels, event.channels2)}
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

// Helper function to render channels
function renderChannels(channels = [], channels2 = []) {
  const mainChannels = channels.map(channel => `
    <div class="channel" data-channel-id="${channel.channel_id}">
      ${channel.channel_name}
    </div>
  `).join('');

  const altChannels = channels2.map(channel => `
    <div class="channel alt-channel" data-channel-id="${channel.channel_id}" data-alt-format="true">
      ${channel.channel_name}
    </div>
  `).join('');

  return `
    <div class="channel-group">
      ${mainChannels}
      ${altChannels}
    </div>
  `;
}
    
function updateStreams() {
  try {
    const streamsContainer = document.getElementById('streamsContainer');
    streamsContainer.innerHTML = '';
    let streamCount = 0;
    for (let i = 1; i <= 6; i++) {
      const streamId = document.getElementById(`streamInput${i}`).value.trim();
      if (streamId) {
        streamCount++;
        const channel = channels.find(ch => ch.id == streamId);
        const wrapper = document.createElement('div');
        wrapper.className = 'iframe-wrapper';
        const streamUrl = channel && channel.customUrl 
                          ? channel.customUrl 
                          : `https://daddylive.mp/embed/stream-${streamId}.php`;
        wrapper.innerHTML = `<iframe src="${streamUrl}" allowfullscreen></iframe>`;
        streamsContainer.appendChild(wrapper);
      }
    }
    streamsContainer.setAttribute('data-stream-count', streamCount);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    streamsContainer.style.gridTemplateColumns = isMobile ? '1fr' : '';
  } catch (e) {
    console.error("Error updating streams:", e);
  }
}
    
function clearStreams() {
  for (let i = 1; i <= 6; i++) {
    document.getElementById(`streamInput${i}`).value = '';
  }
  const streamsContainer = document.getElementById('streamsContainer');
  streamsContainer.innerHTML = '';
  streamsContainer.classList.remove('custom-layout');
}
