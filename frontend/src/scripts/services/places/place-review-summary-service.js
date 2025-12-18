/**
 * @fileoverview Place Review Summary Service
 * Handles streaming review summaries from the backend AI service
 * 
 * @module place-review-summary-service
 * @example
 * import { getReviewSummaryStream } from './place-review-summary-service.js';
 * 
 * // Get and display summary in real-time
 * const summaryText = await getReviewSummaryStream(placeId, {
 *     onChunk: (chunk) => {
 *         console.log('Chunk received:', chunk);
 *         displayElement.textContent += chunk;
 *     },
 *     onComplete: () => {
 *         console.log('Summary complete!');
 *     },
 *     onError: (error) => {
 *         console.error('Stream error:', error);
 *     }
 * });
 */

import { API_BASE } from '/src/scripts/services/api-client.js';

/**
 * Configuration for review summary streaming
 * @typedef {Object} StreamOptions
 * @property {(chunk: string) => void} [onChunk] - Callback when a chunk is received
 * @property {() => void} [onComplete] - Callback when stream is complete
 * @property {(error: Error) => void} [onError] - Callback for errors
 * @property {boolean} [showLoader=true] - Show loading indicator while streaming
 * @property {HTMLElement} [loaderElement] - Custom loader element to show/hide
 */

/**
 * Stream review summary for a place with real-time updates
 * Uses Server-Sent Events (SSE) to receive summary chunks as they're generated
 * 
 * @param {number} placeId - The ID of the place to get reviews for
 * @param {StreamOptions} options - Configuration options for streaming
 * @returns {Promise<string>} Complete summary text when stream finishes
 * @throws {Error} If the place doesn't exist or stream fails
 * 
 * @example
 * try {
 *     const summary = await getReviewSummaryStream(123, {
 *         onChunk: (chunk) => {
 *             document.getElementById('summary-text').textContent += chunk;
 *         },
 *         onComplete: () => {
 *             console.log('Done!');
 *         }
 *     });
 *     console.log('Final summary:', summary);
 * } catch (error) {
 *     console.error('Failed to get summary:', error);
 * }
 */
export async function getReviewSummaryStream(placeId, options = {}) {
    const {
        onChunk = null,
        onComplete = null,
        onError = null,
        showLoader = true,
        loaderElement = null,
    } = options;

    const url = `${API_BASE}/places/${placeId}/review-summary/stream`;
    let fullSummary = '';

    try {
        // Show loader if provided
        if (showLoader && loaderElement) {
            loaderElement.style.display = 'block';
        }

        // Create EventSource for SSE
        const eventSource = new EventSource(url);

        return new Promise((resolve, reject) => {
            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    // Add chunk to full summary
                    if (data.chunk) {
                        fullSummary += data.chunk;

                        // Call onChunk callback if provided
                        if (onChunk && typeof onChunk === 'function') {
                            onChunk(data.chunk);
                        }
                    }

                    // Check if stream is complete
                    if (data.is_complete) {
                        eventSource.close();

                        // Hide loader
                        if (showLoader && loaderElement) {
                            loaderElement.style.display = 'none';
                        }

                        // Call onComplete callback if provided
                        if (onComplete && typeof onComplete === 'function') {
                            onComplete();
                        }

                        // Handle special cases
                        if (data.stop_reason === 'no_reviews') {
                            const noReviewsMsg = 'هیچ نظری برای خلاصه‌سازی وجود ندارد.';
                            fullSummary = noReviewsMsg;
                        }

                        resolve(fullSummary);
                    }
                } catch (parseError) {
                    console.error('Error parsing stream data:', parseError);
                    eventSource.close();

                    if (showLoader && loaderElement) {
                        loaderElement.style.display = 'none';
                    }

                    reject(parseError);
                }
            };

            eventSource.onerror = (error) => {
                eventSource.close();

                // Hide loader
                if (showLoader && loaderElement) {
                    loaderElement.style.display = 'none';
                }

                let errorMessage = 'خطا در دریافت خلاصه نظرات';

                if (error.target.readyState === EventSource.CLOSED) {
                    // Server closed connection
                    if (fullSummary) {
                        // If we got some data before error, still resolve
                        if (onComplete && typeof onComplete === 'function') {
                            onComplete();
                        }
                        resolve(fullSummary);
                        return;
                    }
                    errorMessage = 'اتصال به سرور قطع شد';
                }

                console.error('Stream error:', error);

                // Call onError callback if provided
                if (onError && typeof onError === 'function') {
                    onError(new Error(errorMessage));
                }

                reject(new Error(errorMessage));
            };
        });
    } catch (error) {
        console.error('Failed to initialize stream:', error);

        if (showLoader && loaderElement) {
            loaderElement.style.display = 'none';
        }

        if (onError && typeof onError === 'function') {
            onError(error);
        }

        throw error;
    }
}

/**
 * Simple version without callbacks - just returns the summary
 * Useful for simple use cases where you just want the final text
 * 
 * @param {number} placeId - The ID of the place
 * @returns {Promise<string>} Complete summary text
 * 
 * @example
 * const summary = await getReviewSummary(123);
 * console.log(summary);
 */
export async function getReviewSummary(placeId) {
    return getReviewSummaryStream(placeId);
}

/**
 * Stream summary with a loading spinner
 * Perfect for showing a nice UX while streaming
 * 
 * @param {number} placeId - The ID of the place
 * @param {HTMLElement} summaryContainer - Container to display summary
 * @param {HTMLElement} [loaderElement] - Optional loader element
 * @returns {Promise<string>} Complete summary text
 * 
 * @example
 * await getReviewSummaryWithLoader(
 *     123,
 *     document.getElementById('summary-container'),
 *     document.getElementById('loader')
 * );
 */
export async function getReviewSummaryWithLoader(placeId, summaryContainer, loaderElement = null) {
    return getReviewSummaryStream(placeId, {
        onChunk: (chunk) => {
            summaryContainer.textContent += chunk;
        },
        onComplete: () => {
            summaryContainer.classList.add('summary-complete');
        },
        onError: (error) => {
            summaryContainer.innerHTML = `<div class="error-message">${error.message}</div>`;
        },
        showLoader: !!loaderElement,
        loaderElement: loaderElement,
    });
}
