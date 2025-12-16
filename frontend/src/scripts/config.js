/**
 * Frontend Configuration
 * Reads from config.json file which is set during Docker build
 * Uses synchronous XMLHttpRequest for compatibility with static initialization
 */

let configData = null;

function loadConfig() {
  if (configData) return configData;

  try {
    // Use synchronous XMLHttpRequest for immediate loading
    const xhr = new XMLHttpRequest();

    // Try multiple paths for compatibility (Docker vs live-server)
    const paths = ['/src/config.json', './src/config.json', '/config.json'];
    let loaded = false;
    
    for (const path of paths) {
      try {
        xhr.open('GET', path, false); // false = synchronous
        xhr.send();
        
        if (xhr.status === 200) {
          configData = JSON.parse(xhr.responseText);
          loaded = true;
          console.log(`Config loaded from: ${path}`);
          break;
        }
      } catch (e) {
        // Try next path
        continue;
      }
    }
    
    if (!loaded) {
      throw new Error('Could not load config.json from any path');
    }
  } catch (error) {
    console.warn("Failed to load config.json, using defaults:", error);
    configData = {
      API_BASE_URL: `${window.location.protocol}//${window.location.hostname}:8000/api`,
    };
  }
  return configData;
}

// Load config synchronously on module load
function getAPIBase() {
  const config = loadConfig();
  return config.API_BASE_URL;
}

export { getAPIBase };
