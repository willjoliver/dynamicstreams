function convertGMTToLocal(timeString, dateString) {
  try {
    const cleanDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, '$1');
    const [dayName, day, month, year] = cleanDateString.split(/ |(?=\d{4})/);
    const [hours, minutes] = timeString.split(':');
    const isoDate = new Date(`${month} ${day}, ${year} ${hours}:${minutes}:00 GMT`);
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
  for (let input of inputs) {
    if (input.value.trim() === "") {
      input.value = event.target.dataset.channelId;
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
    const response = await fetch("https://api.allorigins.hexocode.repl.co/get?disableCache=true&url=https://daddylive.mp/schedule/schedule-generated.json");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    const scheduleData = data.contents ? JSON.parse(data.contents) : data;
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
    Object.keys(scheduleData).forEach(date => {
      const [fullDate] = date.split(" - ");
      const [dayName, day, month, year] = fullDate.split(/\s+/);
      const formattedDate = `${dayName} ${month} ${day}, ${year}`;
      const dateDiv = document.createElement("h2");
      dateDiv.className = "schedule-date";
      dateDiv.textContent = formattedDate;
      container.appendChild(dateDiv);
      Object.entries(scheduleData[date]).forEach(([category, events]) => {
        if (!events || category.toLowerCase().includes('tennis')) return;
        const filteredEvents = events.filter(event =>
          event.event && !event.event.toLowerCase().includes('tennis')
        );
        if (filteredEvents.length === 0) return;
        const categoryContainer = document.createElement("div");
        const categoryHeader = document.createElement("div");
        const eventsContainer = document.createElement("div");
        categoryHeader.className = "category-header";
        categoryHeader.innerHTML = `<span>${category}</span><span>▶</span>`;
        eventsContainer.className = "category-events collapsed";
        categoryHeader.addEventListener("click", () => {
          eventsContainer.classList.toggle("collapsed");
          if (!eventsContainer.classList.contains("collapsed")) {
            categoryHeader.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
          categoryHeader.querySelector("span:last-child").textContent =
            eventsContainer.classList.contains("collapsed") ? "▶" : "▼";
        });
        filteredEvents.forEach(event => {
          const eventDiv = document.createElement("div");
          eventDiv.className = "event";
          const localTime = convertGMTToLocal(event.time, fullDate);
          eventDiv.innerHTML = `<h3>${localTime} - ${event.event}</h3>`;
          event.channels.forEach(channel => {
            const channelDiv = document.createElement("div");
            channelDiv.className = "channel";
            channelDiv.textContent = channel.channel_name;
            channelDiv.dataset.channelId = channel.channel_id;
            channelDiv.addEventListener("click", fillEmptyStream);
            eventDiv.appendChild(channelDiv);
          });
          eventsContainer.appendChild(eventDiv);
        });
        categoryContainer.appendChild(categoryHeader);
        categoryContainer.appendChild(eventsContainer);
        container.appendChild(categoryContainer);
      });
    });
  } catch (e) {
    console.error("Error displaying schedule:", e);
    container.textContent = "Error displaying schedule data";
  }
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
