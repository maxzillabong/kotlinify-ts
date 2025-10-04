"use client";

import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";

export default function CoroutinesPage() {
  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-foreground mb-6">Coroutines</h1>
      <p className="text-xl text-muted-foreground mb-12">
        Finally, proper async cancellation without the AbortController nightmare. Manage complex async workflows with confidence, not chaos.
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection
          title="The Async Cancellation Crisis"
          description="You've lost hours debugging memory leaks from uncancelled requests. We've all been there."
        >
          <div className="bg-card border-l-4 border-l-red-500 border border-border rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-foreground mb-4">The JavaScript Reality: A House of Cards</h4>
            <CodeBlock
              code={`// The code every team writes... and regrets
let cancelled = false;
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

async function loadDashboard() {
  try {
    // Fetch user data
    const userReq = fetch('/api/user', { signal: controller.signal });
    if (cancelled) return; // Manual check #1

    // Fetch analytics (oops, forgot the signal!)
    const analyticsReq = fetch('/api/analytics');

    // Fetch notifications
    const notifReq = fetch('/api/notifications', { signal: controller.signal });
    if (cancelled) return; // Manual check #2 (getting tired yet?)

    const [user, analytics, notif] = await Promise.all([
      userReq, analyticsReq, notifReq
    ]);

    if (cancelled) return; // Manual check #3 (did I miss any?)

    // Process results...
    clearTimeout(timeoutId); // Don't forget this!

  } catch (e) {
    if (e.name === 'AbortError') return; // Is this all of them?
    if (e.name === 'TimeoutError') return; // Wait, what throws this?
    clearTimeout(timeoutId); // Did I already clear this?
    throw e;
  }
}

// Component unmounts... memory leak incoming!
// Forgot to: cancelled = true, controller.abort(), clearTimeout()
// Your users' browsers are now running zombie requests`}
              language="typescript"
            />
          </div>

          <div className="bg-card border-l-4 border-l-blue-500 border border-border rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-foreground mb-4">The Coroutine Solution: Structured Concurrency</h4>
            <CodeBlock
              code={`import { coroutineScope, withTimeout, launch } from 'kotlinify-ts/coroutines';

async function loadDashboard() {
  // Everything in this scope is automatically managed
  // Notice: No 'async' keywords needed! The library handles async implicitly
  return withTimeout(5000, () =>
    coroutineScope((scope) => {
      // Launch parallel operations - all automatically cancellable
      const userJob = scope.async(() => fetch('/api/user').then(r => r.json()));
      const analyticsJob = scope.async(() => fetch('/api/analytics').then(r => r.json()));
      const notifJob = scope.async(() => fetch('/api/notifications').then(r => r.json()));

      // If ANY fails or times out, ALL are cancelled
      // If the scope is cancelled, ALL are cancelled
      // No manual checks. No forgotten cleanup. No leaks.

      const [user, analytics, notif] = await Promise.all([
        userJob.await(),
        analyticsJob.await(),
        notifJob.await()
      ]);

      return { user, analytics, notif };
    })
  );
}

// Component unmounts?
const job = launch(() => loadDashboard());
onUnmount(() => job.cancel()); // ONE line cancels EVERYTHING`}
              language="typescript"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-card border-l-4 border-l-yellow-500 border border-border rounded-lg p-4">
              <h4 className="text-foreground font-semibold mb-2">The Hidden Costs of Bad Async</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Memory leaks from uncancelled requests</li>
                <li>• Race conditions from improper cleanup</li>
                <li>• Zombie timers eating CPU cycles</li>
                <li>• State updates after component unmount</li>
                <li>• "Can't perform state update on unmounted component"</li>
                <li>• Users complaining about slow, laggy apps</li>
              </ul>
            </div>
            <div className="bg-card border-l-4 border-l-green-500 border border-border rounded-lg p-4">
              <h4 className="text-foreground font-semibold mb-2">What Coroutines Give You</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Automatic cancellation propagation</li>
                <li>• Parent-child job relationships</li>
                <li>• Built-in timeout handling</li>
                <li>• Resource cleanup guarantees</li>
                <li>• Error boundaries that make sense</li>
                <li>• Happy users with responsive apps</li>
              </ul>
            </div>
          </div>
        </DocsSection>

        <DocsSection
          title="Core Types"
          description="The building blocks of structured concurrency"
        >
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Job</h3>
          <p className="text-muted-foreground mb-4">
            A handle to a running coroutine that can be cancelled, joined, and monitored.
          </p>
          <CodeBlock
            code={`import { Job, launch } from 'kotlinify-ts/coroutines';

// Every launched coroutine returns a Job
const job: Job = launch(function() {
  console.log("Running in job context");
  console.log("Is active?", this.isActive);
});

// Job states
job.isActive;    // true while running
job.isCompleted; // true when finished successfully
job.isCancelled; // true if cancelled

// Job operations
job.cancel("Optional reason");  // Cancel the job
await job.join();               // Wait for completion

// React to cancellation
const job2 = launch(function() {
  this.onCancel(() => {
    console.log("Cleaning up resources");
  });

  // Long running operation
  this.ensureActive(); // Throws CancellationError if cancelled
});`}
            language="typescript"
          />

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Deferred</h3>
          <p className="text-muted-foreground mb-4">
            A Job that produces a value - like a Promise with cancellation support.
          </p>
          <CodeBlock
            code={`import { asyncValue as async, Deferred } from 'kotlinify-ts/coroutines';

// async returns a Deferred<T>
const deferred: Deferred<number> = async(async () => {
  await delay(1000);
  return 42;
});

// Deferred extends Job, so has all Job capabilities
deferred.cancel();
deferred.isActive;

// Get the value
const value = await deferred.await(); // Returns 42

// Check if value is available without waiting
const completed = deferred.getCompleted(); // undefined if not ready`}
            language="typescript"
          />

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">Try it yourself:</h4>
          <CodeBlock
            code={`// Launch a simple coroutine
const job = launch(async () => {
  await delay(100);
  console.log('Job completed!');
  return 'done';
});

console.log('Job launched, waiting...');
await job.join();
console.log('Job finished');

// Use async for values
const result = async(async () => {
  await delay(50);
  return 42;
});

const value = await result.await();
console.log('Result:', value);`}
            language="typescript"
            executable={true}
          />

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">CoroutineScope</h3>
          <p className="text-muted-foreground mb-4">
            A scope that manages multiple coroutines and propagates cancellation.
          </p>
          <CodeBlock
            code={`import { CoroutineScope } from 'kotlinify-ts/coroutines';

const scope = new CoroutineScope();

// Launch children in the scope
const job1 = scope.launch(function() {
  console.log("First coroutine");
});

const deferred = scope.async(async () => {
  await delay(1000);
  return "result";
});

// Cancel all children at once
scope.cancel(); // Cancels job1 and deferred

// Wait for all children
await scope.joinAll();`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Launching Coroutines"
          description="Start concurrent operations with automatic lifecycle management"
        >
          <CodeBlock
            code={`import { launch, asyncValue as async, delay } from 'kotlinify-ts/coroutines';

// launch: Fire-and-forget coroutine
const job = launch(function() {
  console.log("Starting work");
  delay(1000).then(() => {
    console.log("Work complete");
  });

  // Access job context via 'this'
  if (this.isActive) {
    console.log("Still active!");
  }
});

// async: Coroutine that returns a value
const deferred = async(() => {
  return delay(500).then(() => ({ id: 1, name: "User" }));
});

const user = await deferred.await();

// Wrap existing promises
import { wrapAsync } from 'kotlinify-ts/coroutines';

const wrappedFetch = wrapAsync(fetch('/api/data'));
wrappedFetch.cancel(); // Can cancel even native promises!`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Structured Concurrency"
          description="Parent-child relationships ensure no coroutine is left behind"
        >
          <CodeBlock
            code={`import { coroutineScope, supervisorScope, launch, delay } from 'kotlinify-ts/coroutines';

// coroutineScope: Waits for all children before returning
const result = await coroutineScope(async (scope) => {
  // Launch parallel operations
  scope.launch(function() {
    return delay(1000).then(() => {
      console.log("Operation 1 complete");
    });
  });

  scope.launch(function() {
    return delay(500).then(() => {
      console.log("Operation 2 complete");
    });
  });

  // This line executes immediately
  console.log("All launched");

  // Function waits for all children before returning
  return "All done";
}); // Returns only after both operations complete

// Error in child cancels all siblings
try {
  await coroutineScope(async (scope) => {
    scope.launch(function() {
      return delay(1000).then(() => {
        console.log("This won't print");
      });
    });

    scope.launch(function() {
      return delay(100).then(() => {
        throw new Error("Failed!");
      });
    });
  });
} catch (e) {
  console.log("Parent caught:", e.message); // "Failed!"
}

// supervisorScope: Children fail independently
await supervisorScope(async (scope) => {
  scope.launch(function() {
    throw new Error("Child 1 failed");
  });

  scope.launch(function() {
    return delay(100).then(() => {
      console.log("Child 2 continues!"); // Still runs
    });
  });
});`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Timeouts"
          description="Automatically cancel operations that take too long"
        >
          <CodeBlock
            code={`import { withTimeout, withTimeoutOrNull, TimeoutError } from 'kotlinify-ts/coroutines';

// withTimeout: Throws TimeoutError if exceeds time limit
try {
  const data = await withTimeout(5000, () => fetchLargeDataset());
  console.log("Got data:", data);
} catch (e) {
  if (e instanceof TimeoutError) {
    console.error("Operation timed out after 5 seconds");
  }
}

// withTimeoutOrNull: Returns null instead of throwing
const result = await withTimeoutOrNull(3000, () => slowOperation());

if (result === null) {
  console.log("Operation timed out, using cached data");
  return cachedData;
} else {
  return result;
}

// Combine with coroutines for complex timeout scenarios
await coroutineScope(async (scope) => {
  const job1 = scope.async(() =>
    withTimeout(2000, () => fetchUserData())
  );

  const job2 = scope.async(() =>
    withTimeoutOrNull(1000, () => fetchOptionalData())
  );

  const [userData, optionalData] = await Promise.all([
    job1.await(),
    job2.await()
  ]);

  return { userData, optionalData: optionalData || defaults };
});`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Cancellation Patterns"
          description="Handle cancellation gracefully throughout your async operations"
        >
          <CodeBlock
            code={`import { launch, delay, CancellationError, coroutineScope } from 'kotlinify-ts/coroutines';

// Parent-child relationships require a scope
await coroutineScope(async (scope) => {
  const parent = scope.launch(function() {
    return coroutineScope(async (childScope) => {
      const child = childScope.launch(function() {
        return delay(5000).then(() => {
          console.log("Child completed"); // Never runs if cancelled
        }).catch(e => {
          if (e instanceof CancellationError) {
            console.log("Child was cancelled");
          }
        });
      });

      return delay(1000).then(() => {
        parent.cancel(); // Cancels both parent and child
      });
    });
  });
});

// Check cancellation at critical points
const job = launch(function() {
  return fetchData()
    .then(data => {
      this.ensureActive(); // Throws if cancelled
      return processData(data);
    })
    .then(processed => {
      this.ensureActive(); // Check again
      return saveResults(processed);
    });
});

// Register cleanup callbacks
const connection = launch(function() {
  const ws = new WebSocket(url);

  this.onCancel(() => {
    console.log("Closing websocket");
    ws.close();
  });

  // Use connection...
  return handleMessages(ws);
});

// Later...
connection.cancel(); // Cleanup runs automatically`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Real-World Examples"
          description="Practical patterns for production applications"
        >
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Parallel Data Loading</h3>
          <CodeBlock
            code={`import { coroutineScope, withTimeout } from 'kotlinify-ts/coroutines';

async function loadDashboard(userId: string) {
  return coroutineScope(async (scope) => {
    // Launch all requests in parallel
    const userJob = scope.async(() =>
      withTimeout(3000, () => fetchUser(userId))
    );

    const ordersJob = scope.async(() =>
      withTimeout(5000, () => fetchOrders(userId))
    );

    const analyticsJob = scope.async(() =>
      withTimeoutOrNull(2000, () => fetchAnalytics(userId))
    );

    // Wait for all to complete
    const [user, orders, analytics] = await Promise.all([
      userJob.await(),
      ordersJob.await(),
      analyticsJob.await()
    ]);

    return {
      user,
      orders,
      analytics: analytics || { visits: 0, revenue: 0 }
    };
  });
}`}
            language="typescript"
          />

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Retry with Timeout</h3>
          <CodeBlock
            code={`import { launch, delay, withTimeoutOrNull } from 'kotlinify-ts/coroutines';

async function fetchWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  timeoutMs = 5000
): Promise<T | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await withTimeoutOrNull(timeoutMs, operation);

    if (result !== null) {
      return result;
    }

    if (attempt < maxRetries) {
      console.log(\`Attempt \${attempt} timed out, retrying...\`);
      await delay(1000 * attempt);
    }
  }

  return null;
}

// Usage
const data = await fetchWithRetry(
  () => fetch('/api/data').then(r => r.json()),
  3,
  5000
);`}
            language="typescript"
          />

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Background Task Manager</h3>
          <CodeBlock
            code={`import { CoroutineScope, delay } from 'kotlinify-ts/coroutines';

class BackgroundTaskManager {
  private scope = new CoroutineScope();

  startPeriodicSync(intervalMs: number) {
    return this.scope.launch(function() {
      const loop = async () => {
        while (this.isActive) {
          try {
            await syncData();
            await delay(intervalMs);
          } catch (error) {
            console.error("Sync failed:", error);
            await delay(5000);
          }
        }
      };
      return loop();
    });
  }

  startEventListener() {
    return this.scope.launch(function() {
      const events = new EventSource('/events');

      this.onCancel(() => events.close());

      events.onmessage = (e) => {
        if (this.isActive) {
          handleEvent(JSON.parse(e.data));
        }
      };

      return new Promise(() => {});
    });
  }

  async shutdown() {
    console.log("Shutting down background tasks...");
    this.scope.cancel("Application shutdown");
    await this.scope.joinAll();
    console.log("All tasks stopped");
  }
}

const manager = new BackgroundTaskManager();
manager.startPeriodicSync(30000);
manager.startEventListener();

// On app shutdown
process.on('SIGTERM', () => manager.shutdown());`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Error Types"
          description="Built-in error types for async operations"
        >
          <CodeBlock
            code={`import { CancellationError, TimeoutError } from 'kotlinify-ts/coroutines';

// CancellationError: Thrown when a job is cancelled
try {
  const job = launch(function() {
    return delay(1000).then(() => {
      this.ensureActive(); // Throws if cancelled
    });
  });

  job.cancel("User navigated away");
  await job.join();
} catch (e) {
  if (e instanceof CancellationError) {
    console.log("Job was cancelled:", e.message);
  }
}

// TimeoutError: Thrown when operation exceeds time limit
try {
  await withTimeout(1000, () => delay(2000));
} catch (e) {
  if (e instanceof TimeoutError) {
    console.log("Operation timed out:", e.message);
  }
}

// Distinguish between different error types
async function robustFetch(url: string) {
  try {
    return await withTimeout(5000, () => fetch(url));
  } catch (e) {
    if (e instanceof TimeoutError) {
      return { error: 'timeout', cached: getCached(url) };
    } else if (e instanceof CancellationError) {
      return { error: 'cancelled' };
    } else {
      return { error: 'network', message: e.message };
    }
  }
}`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Best Practices"
          description="Guidelines for effective coroutine usage"
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Use structured concurrency</h4>
              <p className="text-muted-foreground">
                Always use coroutineScope or supervisorScope when launching multiple coroutines.
                This ensures proper cleanup and error propagation.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Check cancellation in long operations</h4>
              <p className="text-muted-foreground">
                Call this.ensureActive() at critical points in long-running operations to
                respect cancellation promptly.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Register cleanup callbacks</h4>
              <p className="text-muted-foreground">
                Use this.onCancel() to ensure resources like connections, timers, and subscriptions
                are properly cleaned up when a coroutine is cancelled.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Prefer withTimeoutOrNull for optional operations</h4>
              <p className="text-muted-foreground">
                Use withTimeoutOrNull when the operation is optional and you have a fallback.
                Use withTimeout when timeout is an error condition.
              </p>
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4">
            <Link
              href="/docs/monads"
              className="px-6 py-3 bg-foreground hover:bg-foreground/90 text-background font-semibold rounded-lg transition-colors"
            >
              Typed Errors →
            </Link>
            <Link
              href="/docs/flow"
              className="px-6 py-3 bg-card hover:bg-card text-foreground font-semibold rounded-lg border border-border transition-colors"
            >
              Flow Streams
            </Link>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}
