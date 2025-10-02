# Server-Side Use Cases Guide

Comprehensive guide for using kotlinify-ts in Node.js/backend applications.

## Table of Contents

- [Express.js Integration](#expressjs-integration)
- [Database Operations](#database-operations)
- [API Development](#api-development)
- [Background Jobs](#background-jobs)
- [File Processing](#file-processing)
- [Stream Processing](#stream-processing)
- [Caching](#caching)
- [Error Handling](#error-handling)

---

## Express.js Integration

### Basic Setup

```typescript
import express from 'express';
import { tryCatch, Result, apply } from 'kotlinify-ts';

const app = express();

// Middleware with Result
app.use((req, res, next) => {
  tryCatch(() => {
    // Validate request
    return req;
  })
  .fold(
    error => res.status(400).json({ error: error.message }),
    () => next()
  );
});
```

---

### Route Handlers with Result Monad

```typescript
import { Router } from 'express';
import { tryCatch, Result } from 'kotlinify-ts';

const router = Router();

// Safe route handler
router.get('/users/:id', async (req, res) => {
  const result = await tryCatch(() => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    const user = db.users.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  });

  result.fold(
    error => res.status(404).json({ error: error.message }),
    user => res.json(user)
  );
});

// Chained operations
router.post('/users', async (req, res) => {
  const result = await tryCatch(() => req.body)
    .map(validateUserInput)
    .flatMap(data => tryCatch(() => db.users.create(data)))
    .map(user => ({
      id: user.id,
      name: user.name,
      email: user.email
    }));

  result.fold(
    error => res.status(400).json({ error: error.message }),
    user => res.status(201).json(user)
  );
});
```

---

### Middleware Pipeline with Scope Functions

```typescript
import { apply, also } from 'kotlinify-ts';

// Authentication middleware
const authenticate = (req, res, next) => {
  apply(req.headers.authorization, token => {
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    req.user = verifyToken(token);
  })
  .also(req => console.log(`User ${req.user?.id} authenticated`))
  .let(() => next());
};

// Request logging middleware
const logRequest = (req, res, next) => {
  also(req, r => {
    console.log(`${r.method} ${r.path}`, {
      user: r.user?.id,
      ip: r.ip,
      timestamp: new Date().toISOString()
    });
  });

  next();
};

app.use(logRequest, authenticate);
```

---

## Database Operations

### Query Builder with Scope Functions

```typescript
import { apply, let as kLet } from 'kotlinify-ts';

class QueryBuilder<T> {
  private filters: any[] = [];
  private sortBy?: string;
  private limitCount?: number;

  filter(condition: any) {
    return apply(this, qb => {
      qb.filters.push(condition);
    });
  }

  sort(field: string) {
    return apply(this, qb => {
      qb.sortBy = field;
    });
  }

  limit(count: number) {
    return apply(this, qb => {
      qb.limitCount = count;
    });
  }

  async execute(): Promise<T[]> {
    return kLet(this.buildQuery(), query =>
      db.execute<T>(query)
    );
  }

  private buildQuery() {
    // Build SQL/query from filters, sort, limit
    return {
      filters: this.filters,
      sort: this.sortBy,
      limit: this.limitCount
    };
  }
}

// Usage
const users = await new QueryBuilder<User>()
  .filter({ active: true })
  .filter({ age: { $gte: 18 } })
  .sort('createdAt')
  .limit(10)
  .execute();
```

---

### Transaction Handling

```typescript
import { tryCatch, also } from 'kotlinify-ts';

async function transferFunds(
  fromId: number,
  toId: number,
  amount: number
): Promise<Result<Transaction>> {
  return tryCatch(() => {
    const transaction = db.transaction((tx) => {
      // Debit from sender
      const from = tx.accounts.findById(fromId);
      if (from.balance < amount) {
        throw new Error('Insufficient funds');
      }

      tx.accounts.update(fromId, {
        balance: from.balance - amount
      });

      // Credit to receiver
      const to = tx.accounts.findById(toId);
      tx.accounts.update(toId, {
        balance: to.balance + amount
      });

      return {
        id: generateId(),
        fromId,
        toId,
        amount,
        timestamp: new Date()
      };
    });

    return also(transaction, t => {
      console.log(`Transfer completed: ${t.id}`);
      notifyUsers(fromId, toId, amount);
    });
  });
}

// Usage
const result = await transferFunds(123, 456, 100);

result.fold(
  error => console.error('Transfer failed:', error),
  tx => console.log('Transfer successful:', tx.id)
);
```

---

### Bulk Operations with Sequences

```typescript
import { sequenceOf, asSequence } from 'kotlinify-ts';

async function processBulkUsers(userIds: number[]) {
  // Process in batches to avoid memory issues
  const results = await userIds
    .asSequence()
    .chunked(100)  // Process 100 at a time
    .map(async batch => {
      const users = await db.users.findByIds(batch);
      return users.map(processUser);
    })
    .flatMap(promises => sequenceOf(...await promises))
    .filter(result => result.success)
    .toArray();

  return results;
}

// Lazy database scan
async function* scanUsers() {
  let offset = 0;
  const limit = 1000;

  while (true) {
    const users = await db.users.find({ limit, offset });

    if (users.length === 0) break;

    for (const user of users) {
      yield user;
    }

    offset += limit;
  }
}

// Process millions of records without loading all into memory
import { flow } from 'kotlinify-ts';

const processedCount = await flow(scanUsers)
  .filter(user => user.active)
  .map(user => updateUser(user))
  .count();

console.log(`Processed ${processedCount} users`);
```

---

## API Development

### RESTful API with Result Monad

```typescript
import { Router } from 'express';
import { tryCatch, fromNullable, also } from 'kotlinify-ts';

const api = Router();

// GET /api/users
api.get('/users', async (req, res) => {
  const result = await tryCatch(() => db.users.findAll())
    .map(users =>
      users.map(u => ({ id: u.id, name: u.name, email: u.email }))
    )
    .also(users => console.log(`Returned ${users.length} users`));

  result.fold(
    error => res.status(500).json({ error: error.message }),
    users => res.json(users)
  );
});

// GET /api/users/:id
api.get('/users/:id', async (req, res) => {
  const result = await tryCatch(() => db.users.findById(parseInt(req.params.id)))
    .flatMap(user => fromNullable(user))
    .map(user => ({ id: user.id, name: user.name, email: user.email }));

  result.fold(
    () => res.status(404).json({ error: 'User not found' }),
    user => res.json(user)
  );
});

// POST /api/users
api.post('/users', async (req, res) => {
  const result = await tryCatch(() => validateInput(req.body))
    .flatMap(data => tryCatch(() => db.users.create(data)))
    .also(user => sendWelcomeEmail(user.email))
    .also(user => analytics.track('user_created', { userId: user.id }));

  result.fold(
    error => res.status(400).json({ error: error.message }),
    user => res.status(201).json(user)
  );
});

// PATCH /api/users/:id
api.patch('/users/:id', async (req, res) => {
  const result = await tryCatch(() => db.users.findById(parseInt(req.params.id)))
    .flatMap(user => fromNullable(user))
    .flatMap(user =>
      tryCatch(() => db.users.update(user.id, req.body))
    )
    .also(user => cache.invalidate(`user:${user.id}`));

  result.fold(
    error => res.status(400).json({ error: error.message }),
    user => res.json(user)
  );
});

// DELETE /api/users/:id
api.delete('/users/:id', async (req, res) => {
  const result = await tryCatch(() => db.users.delete(parseInt(req.params.id)))
    .also(() => console.log(`Deleted user ${req.params.id}`));

  result.fold(
    error => res.status(400).json({ error: error.message }),
    () => res.status(204).send()
  );
});
```

---

### GraphQL Resolvers

```typescript
import { tryCatch, flowOf } from 'kotlinify-ts';

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      const result = await tryCatch(() => db.users.findById(id));
      return result.getOrElse(null);
    },

    users: async (_, { limit = 10, offset = 0 }) => {
      const result = await tryCatch(() =>
        db.users.find({ limit, offset })
      );
      return result.getOrElse([]);
    }
  },

  User: {
    posts: async (user) => {
      const result = await tryCatch(() =>
        db.posts.findByUserId(user.id)
      );
      return result.getOrElse([]);
    },

    friends: async (user) => {
      // Lazy load friends
      return flowOf(...user.friendIds)
        .map(id => db.users.findById(id))
        .take(10)  // Limit to 10
        .toArray();
    }
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const result = await tryCatch(() => validateInput(input))
        .flatMap(data => tryCatch(() => db.users.create(data)))
        .also(user => publishEvent('USER_CREATED', user));

      return result.fold(
        error => { throw error; },
        user => user
      );
    }
  }
};
```

---

## Background Jobs

### Job Queue with Flow

```typescript
import { MutableSharedFlow, flow } from 'kotlinify-ts';

interface Job {
  id: string;
  type: string;
  data: any;
  retries: number;
}

class JobQueue {
  private jobs = new MutableSharedFlow<Job>({ replay: 0 });
  private processing = false;

  async enqueue(job: Job) {
    await this.jobs.emit(job);
  }

  start(workers: number = 4) {
    if (this.processing) return;
    this.processing = true;

    // Create worker pool
    Array.from({ length: workers }, () =>
      this.jobs
        .map(async job => {
          console.log(`Processing job ${job.id}`);
          return await this.processJob(job);
        })
        .collect(result => {
          result.fold(
            error => console.error('Job failed:', error),
            () => console.log('Job completed')
          );
        })
    );
  }

  private async processJob(job: Job): Promise<Result<void>> {
    return tryCatch(() => {
      switch (job.type) {
        case 'EMAIL':
          sendEmail(job.data);
          break;
        case 'REPORT':
          generateReport(job.data);
          break;
        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }
    });
  }
}

// Usage
const queue = new JobQueue();
queue.start(4);  // 4 workers

await queue.enqueue({
  id: '123',
  type: 'EMAIL',
  data: { to: 'user@example.com', subject: 'Hello' },
  retries: 0
});
```

---

### Scheduled Tasks with Coroutines

```typescript
import { launch, delay } from 'kotlinify-ts';

// Run task every N seconds
function scheduleRecurring(
  task: () => Promise<void>,
  intervalMs: number
) {
  return launch(function() {
    while (true) {
      this.ensureActive();  // Check if cancelled

      tryCatch(task).fold(
        error => console.error('Task failed:', error),
        () => console.log('Task completed')
      );

      delay(intervalMs);
    }
  });
}

// Usage
const cleanupJob = scheduleRecurring(
  async () => {
    const old = await db.sessions.findExpired();
    await db.sessions.deleteMany(old.map(s => s.id));
    console.log(`Cleaned up ${old.length} sessions`);
  },
  60 * 1000  // Every 60 seconds
);

// Stop when needed
cleanupJob.cancel();
```

---

## File Processing

### Stream Processing with Flow

```typescript
import { createReadStream } from 'fs';
import { callbackFlow, flow } from 'kotlinify-ts';
import { parse } from 'csv-parse';

function readCSV(filepath: string): Flow<Record<string, string>> {
  return callbackFlow(scope => {
    const stream = createReadStream(filepath)
      .pipe(parse({ columns: true }));

    stream.on('data', (row) => {
      scope.emit(row);
    });

    stream.on('end', () => {
      scope.close();
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error);
      scope.close();
    });

    scope.onClose(() => {
      stream.destroy();
    });
  });
}

// Process large CSV file
async function importUsers(filepath: string) {
  let processed = 0;
  let failed = 0;

  await readCSV(filepath)
    .map(row => ({
      name: row.name,
      email: row.email,
      age: parseInt(row.age)
    }))
    .filter(user => user.email && user.age > 0)
    .chunked(100)  // Batch inserts
    .map(async batch => {
      const result = await tryCatch(() =>
        db.users.insertMany(batch)
      );

      result.fold(
        () => failed += batch.length,
        () => processed += batch.length
      );
    })
    .collect(() => {});

  console.log(`Imported ${processed} users, ${failed} failed`);
}
```

---

### File Upload Handling

```typescript
import multer from 'multer';
import { tryCatch, also } from 'kotlinify-ts';

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  const result = await tryCatch(() => {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    return req.file;
  })
  .map(file => ({
    originalName: file.originalname,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype
  }))
  .also(file => console.log(`File uploaded: ${file.originalName}`))
  .flatMap(file =>
    tryCatch(() => processFile(file))
  );

  result.fold(
    error => res.status(400).json({ error: error.message }),
    processed => res.json(processed)
  );
});

async function processFile(file: any) {
  // Resize image, generate thumbnail, etc.
  return also(file, f => {
    console.log(`Processing file: ${f.filename}`);
  }).let(f => ({
    url: `/uploads/${f.filename}`,
    thumbnail: `/uploads/thumb_${f.filename}`
  }));
}
```

---

## Stream Processing

### Log Processing

```typescript
import { Tail } from 'tail';
import { callbackFlow } from 'kotlinify-ts';

function tailLog(filepath: string): Flow<string> {
  return callbackFlow(scope => {
    const tail = new Tail(filepath);

    tail.on('line', (line) => {
      scope.emit(line);
    });

    tail.on('error', (error) => {
      console.error('Tail error:', error);
    });

    scope.onClose(() => {
      tail.unwatch();
    });
  });
}

// Process logs in real-time
tailLog('/var/log/app.log')
  .filter(line => line.includes('ERROR'))
  .map(line => parseLogLine(line))
  .debounce(1000)  // Group errors within 1 second
  .collect(error => {
    // Alert on errors
    alerting.send({
      severity: 'high',
      message: error.message
    });
  });
```

---

### Data Pipeline

```typescript
import { flow } from 'kotlinify-ts';

async function processPipeline(data: any[]) {
  return await flow(function*() {
    for (const item of data) {
      yield item;
    }
  })
  .map(item => normalize(item))           // Step 1: Normalize
  .filter(item => validate(item))         // Step 2: Validate
  .map(item => enrich(item))              // Step 3: Enrich
  .flatMap(item => transform(item))       // Step 4: Transform
  .map(item => db.save(item))             // Step 5: Save
  .collect(() => {});
}
```

---

## Caching

### LRU Cache with Scope Functions

```typescript
import { apply, let as kLet, also } from 'kotlinify-ts';

class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    return kLet(this.cache.get(key), value => {
      if (value !== undefined) {
        // Move to end (most recently used)
        this.cache.delete(key);
        this.cache.set(key, value);
      }
      return value;
    });
  }

  set(key: K, value: V): void {
    apply(this.cache, cache => {
      if (cache.has(key)) {
        cache.delete(key);
      } else if (cache.size >= this.maxSize) {
        // Remove least recently used (first item)
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      cache.set(key, value);
    })
    .also(() => console.log(`Cached: ${key}`));
  }
}

// Usage
const cache = new LRUCache<string, User>(1000);

async function getUser(id: number): Promise<User> {
  const cacheKey = `user:${id}`;

  return kLet(cache.get(cacheKey), cached =>
    cached ?? kLet(await db.users.findById(id), user => {
      cache.set(cacheKey, user);
      return user;
    })
  );
}
```

---

### Redis Integration

```typescript
import Redis from 'ioredis';
import { tryCatch, also } from 'kotlinify-ts';

const redis = new Redis();

async function cachedQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<Result<T>> {
  // Try cache first
  const cached = await tryCatch(() => redis.get(key))
    .flatMap(data => fromNullable(data))
    .flatMap(data => tryCatch(() => JSON.parse(data)));

  if (cached.isSuccess()) {
    return cached.also(() => console.log(`Cache hit: ${key}`));
  }

  // Cache miss - fetch and cache
  return await tryCatch(fetcher)
    .also(data =>
      redis.setex(key, ttl, JSON.stringify(data))
    )
    .also(() => console.log(`Cache miss: ${key}`));
}

// Usage
const users = await cachedQuery(
  'users:active',
  () => db.users.findAll({ active: true }),
  3600
);
```

---

## Error Handling

### Global Error Handler

```typescript
import { tryCatch } from 'kotlinify-ts';

// Express error handling middleware
app.use((err, req, res, next) => {
  tryCatch(() => {
    console.error('Error:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: err.details
      });
    }

    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    return res.status(500).json({
      error: 'Internal server error'
    });
  });
});
```

---

### Graceful Shutdown

```typescript
import { launch } from 'kotlinify-ts';

const jobs: Job[] = [];

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');

  // Cancel all running jobs
  jobs.forEach(job => job.cancel());

  // Wait for cleanup
  await Promise.all(jobs.map(job => job.join().catch(() => {})));

  // Close connections
  await db.close();
  await redis.quit();

  process.exit(0);
});
```

---

## Best Practices

### 1. Always Handle Errors

```typescript
// ✅ Good
const result = await tryCatch(() => riskyOperation());
result.fold(
  error => handleError(error),
  value => handleSuccess(value)
);

// ❌ Bad
const value = await riskyOperation();  // Might throw
```

### 2. Use Scope Functions for Config

```typescript
// ✅ Good
const server = apply(express(), app => {
  app.use(cors());
  app.use(express.json());
  app.use('/api', router);
});

// ❌ Bad
const server = express();
server.use(cors());
server.use(express.json());
server.use('/api', router);
```

### 3. Leverage Lazy Evaluation

```typescript
// ✅ Good - Only processes 100 records
const result = largeDataset
  .asSequence()
  .filter(predicate)
  .take(100)
  .toArray();

// ❌ Bad - Processes all records
const result = largeDataset
  .filter(predicate)
  .slice(0, 100);
```

### 4. Use Flow for Streams

```typescript
// ✅ Good - Backpressure handling
await flow(dataStream)
  .buffer(100)
  .map(process)
  .collect(save);

// ❌ Bad - No backpressure
dataStream.on('data', async (data) => {
  await process(data);
  await save(data);
});
```
