"use client";

import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";

export default function ServerSidePage() {
  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">Server-Side Guide</h1>
      <p className="text-xl text-gray-300 mb-12">
        Node.js, Express, backend applications, and API development
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection
          title="Express Middleware"
          description="Use typed errors for clean middleware and request handling."
        >
          <CodeBlock
            code={`import { Either, Left, Right } from 'kotlinify-ts/monads';

// Validate and process request with Either
function validateRequest(req) {
  return req.body ? Right(req.body) : Left({ code: 400, message: 'No body' });
}

validateRequest(req)
  .flatMap(body => authenticate(body))
  .flatMap(user => authorize(user, action))
  .flatMap(user => processRequest(user))
  .fold(
    error => res.status(error.code).json({ error: error.message }),
    data => res.json(data)
  );

// Auth token validation
const token = req.headers.authorization;
(token ? Right(token) : Left('No token'))
  .flatMap(t => verifyToken(t))
  .flatMap(user => checkPermissions(user, action))
  .fold(
    error => res.status(401).json({ error }),
    user => next()
  );`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Database Operations"
          description="Chain database queries with error recovery and transaction support."
        >
          <CodeBlock
            code={`import { tryCatch, also } from 'kotlinify-ts';

tryCatch(() => db.findUser(id))
  .flatMap(user => tryCatch(() => db.findOrders(user.id)))
  .map(orders => calculateTotal(orders))
  .onSuccess(total => db.updateTotal(id, total))
  .fold(
    error => rollback(error),
    total => commit(total)
  );

also(db.transaction(), tx => {
  tryCatch(() => tx.insert(user))
    .flatMap(() => tryCatch(() => tx.insert(profile)))
    .fold(
      error => tx.rollback(),
      () => tx.commit()
    );
});`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="API Request Handling"
          description="Build robust API endpoints with validation and error handling."
        >
          <CodeBlock
            code={`import { tryCatch } from 'kotlinify-ts';

app.post("/api/users", (req, res) => {
  tryCatch(() => validateInput(req.body))
    .flatMap(data => tryCatch(() => sanitize(data)))
    .flatMap(data => tryCatch(() => checkDuplicates(data)))
    .flatMap(data => tryCatch(() => hashPassword(data)))
    .flatMap(data => tryCatch(() => saveToDatabase(data)))
    .flatMap(user => tryCatch(() => sendWelcomeEmail(user)))
    .map(user => formatUserResponse(user))
    .fold(
      error => res.status(400).json({ error }),
      user => res.status(201).json(user)
    );
});

Either.from(getRequestData(req))
  .flatMap(data => validateSchema(data))
  .flatMap(valid => processData(valid))
  .map(result => transformResult(result))
  .fold(
    error => res.status(400).json({ error }),
    data => res.json(data)
  );`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Background Jobs"
          description="Run background tasks with coroutines and structured concurrency."
        >
          <CodeBlock
            code={`import { launch, parallel, also } from 'kotlinify-ts/coroutines';

const queue = createJobQueue();
queue.subscribe(job =>
  launch(() => {
    processJob(job);
  })
    .catch(error => {
      logger.error("Job failed:", error);
      queue.retry(job);
    })
);

parallel([
  () => sendEmails(batch),
  () => processImages(batch),
  () => generateReports(batch)
])
  .then(results => logResults(results))
  .catch(error => notifyAdmin(error));`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Stream Processing"
          description="Process large datasets efficiently with sequences and flows."
        >
          <CodeBlock
            code={`import { asSequence } from 'kotlinify-ts/sequence';

asSequence(db.streamUsers())
  .filter(user => user.isActive)
  .map(user => enrichUserData(user))
  .chunked(100)
  .forEach(batch => processBatch(batch));

asSequence(getLogFiles())
  .flatMap(file => readLines(file))
  .filter(line => line.includes("ERROR"))
  .map(line => parseError(line))
  .groupBy(error => error.type)
  .forEach(([type, errors]) => report(type, errors));`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Caching Strategies"
          description="Implement caching with scope functions and error recovery."
        >
          <CodeBlock
            code={`import { also, let } from 'kotlinify-ts';
import { fromNullable, Some } from 'kotlinify-ts';

const key = getCacheKey(req);
const cached = let(key, k => cache.get(k));

fromNullable(cached)
  .orElse(() => {
    const data = fetchData();
    also(data, d => cache.set(key, d));
    return Some(data);
  })
  .getOrThrow();

tryCatch(() => cache.get(key))
  .recover(() => {
    const data = fetchFromDb(key);
    also(data, d => cache.set(key, d, ttl));
    return data;
  })
  .fold(
    error => res.status(500).json({ error }),
    data => res.json(data)
  );`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Rate Limiting"
          description="Implement rate limiting with windowed operations and flows."
        >
          <CodeBlock
            code={`import { windowed } from 'kotlinify-ts/collections';
import { Option } from 'kotlinify-ts/monads';

const log = getRequestLog(userId);
const windows = windowed(log, 100, 1);
const recentWindows = windows.map(window => window.filter(isRecent));
const exceeded = recentWindows.find(window => window.length > limit);

Option.from(exceeded)
  .fold(
    () => next(),
    () => res.status(429).json({ error: "Rate limit exceeded" })
  );

requestFlow
  .throttle(100)
  .filter(req => !isRateLimited(req))
  .collect(req => processRequest(req));`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Parallel Processing"
          description="Process multiple operations in parallel with automatic error handling."
        >
          <CodeBlock
            code={`import { parallelMap } from 'kotlinify-ts/coroutines';

parallelMap(getUserIds(), id => fetchUserData(id))
  .then(users => users.filter(Boolean))
  .then(users => saveToCache(users))
  .catch(error => logger.error("Batch failed:", error));

parallel([
  () => updateSearchIndex(),
  () => regenerateSitemap(),
  () => clearCache(),
  () => notifySubscribers()
])
  .then(() => logger.info("Deployment tasks completed"))
  .catch(error => rollbackDeployment(error));`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4">
            <Link
              href="/docs/api"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
            >
              API Reference →
            </Link>
            <Link
              href="/docs/client-side"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors"
            >
              Client-Side Guide
            </Link>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}
