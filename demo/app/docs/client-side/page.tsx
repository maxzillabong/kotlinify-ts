"use client";

import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";

export default function ClientSidePage() {
  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">Client-Side Guide</h1>
      <p className="text-xl text-gray-300 mb-12">
        React, Vue, browser applications, and frontend patterns
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection
          title="React Integration"
          description="Use kotlinify-ts with React hooks and state management for cleaner component logic."
        >
          <CodeBlock
            code={`import { MutableStateFlow } from 'kotlinify-ts/flow';
import { tryCatchAsync } from 'kotlinify-ts/monads';
import { useEffect, useState } from 'react';

function UserProfile({ userId }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    tryCatchAsync(async () => {
      const response = await fetchUser(userId);
      const data = await response.json();
      return data.profile;
    })
      .then(result => result
        .onSuccess(profile => {
          console.log("Loaded:", profile.name);
          cache.set(userId, profile);
        })
        .fold(
          err => setError(err.message),
          profile => setProfile(profile)
        )
      );
  }, [userId]);

  if (error) return <div>Error: {error}</div>;
  return profile ? <div className="profile">{profile.name}</div> : null;
}

// Reactive state with kotlinify-ts StateFlow
const userState = new MutableStateFlow(null);

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    return userState.collect(user => {
      if (user) setUsers(prev => [...prev, user]);
    });
  }, []);

  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="State Management"
          description="Manage application state with StateFlow and reactive patterns."
        >
          <CodeBlock
            code={`import { MutableStateFlow } from 'kotlinify-ts/flow';

const store = new MutableStateFlow({ users: [], loading: false });

// Subscribe to state changes
store.collect(state => {
  renderUserList(state.users);
  toggleSpinner(state.loading);
});

// Update state
store.update(s => ({ ...s, loading: true }));
fetch('/api/users')
  .then(res => res.json())
  .then(users => store.update(s => ({ ...s, users, loading: false })));

// Derive and react to specific state slices
store
  .map(state => state.users.filter(u => u.active))
  .distinctUntilChanged()
  .collect(activeUsers => updateActiveUserCount(activeUsers.length));`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Form Handling"
          description="Handle form validation and submission with typed errors."
        >
          <CodeBlock
            code={`import { Either, Left, Right } from 'kotlinify-ts/monads';

function handleSubmit(formData) {
  validateEmail(formData.email)
    .flatMap(email => validatePassword(formData.password)
      .map(password => ({ email, password })))
    .flatMap(credentials => submitToAPI(credentials))
    .fold(
      error => showError(error.message),
      user => redirectToDashboard(user.id)
    );
}

function validateEmail(email) {
  return email.includes('@')
    ? Right(email)
    : Left({ field: 'email', message: 'Invalid email' });
}

// Debounced validation stream
inputElement.addEventListener('input', e => {
  inputFlow.emit(e.target.value);
});

inputFlow
  .debounce(300)
  .map(value => validateInput(value))
  .collect(result =>
    result.fold(
      error => showFieldError(error),
      valid => clearFieldError()
    )
  );`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Event Handling"
          description="Create reactive event streams with SharedFlow for user interactions."
        >
          <CodeBlock
            code={`import { MutableSharedFlow, merge } from 'kotlinify-ts/flow';

const clicks$ = new MutableSharedFlow();
document.addEventListener("click", e => clicks$.emit(e));

// Filter and handle button clicks with debouncing
clicks$
  .filter(e => e.target.matches("button.action"))
  .map(e => ({ action: e.target.dataset.action, target: e.target }))
  .debounce(200)
  .collect(({ action, target }) => {
    target.classList.add('processing');
    handleAction(action).finally(() =>
      target.classList.remove('processing')
    );
  });

// Combine multiple input sources
const keyboard$ = new MutableSharedFlow();
const touch$ = new MutableSharedFlow();

document.addEventListener('keydown', e => keyboard$.emit(e));
document.addEventListener('touchstart', e => touch$.emit(e));

merge(clicks$, keyboard$, touch$)
  .throttle(100)
  .collect(event => processUserInput(event));`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="API Calls"
          description="Handle API requests with error recovery and loading states."
        >
          <CodeBlock
            code={`import { tryCatch } from 'kotlinify-ts/monads';
import { withTimeout } from 'kotlinify-ts/coroutines';

async function loadUserData(userId) {
  return withTimeout(5000, () => fetch(\`/api/users/\${userId}\`))
    .then(res => tryCatch(() => res.json()))
    .then(result => result
      .map(data => normalizeUser(data))
      .onSuccess(user => cache.set(userId, user))
      .onFailure(error => logger.error("Parse failed:", error))
      .fold(
        error => ({ error: error.message }),
        user => ({ user })
      )
    );
}

// Parallel requests with error handling
async function loadDashboard(userId) {
  const [userResult, postsResult, commentsResult] = await Promise.all([
    tryCatch(() => fetchUser(userId)),
    tryCatch(() => fetchPosts(userId)),
    tryCatch(() => fetchComments(userId))
  ]);

  if (userResult.isFailure) {
    return showError("Failed to load user");
  }

  renderDashboard({
    user: userResult.get(),
    posts: postsResult.getOrElse([]),
    comments: commentsResult.getOrElse([])
  });
}`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="WebSocket Streams"
          description="Handle WebSocket connections as reactive streams with automatic reconnection."
        >
          <CodeBlock
            code={`import { callbackFlow } from 'kotlinify-ts/flow';

function createWebSocketFlow(url) {
  return callbackFlow(async (scope) => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      scope.emit(JSON.parse(event.data));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      scope.close();
    };

    scope.onClose(() => ws.close());
  });
}

createWebSocketFlow('wss://api.example.com/live')
  .filter(data => data.type === "price_update")
  .distinctUntilChangedBy(data => data.symbol)
  .map(data => ({ symbol: data.symbol, price: data.price }))
  .collect(update => updatePriceDisplay(update));

// With retry logic
createWebSocketFlow(url)
  .retry(3)
  .catch(error => {
    showConnectionError("Connection lost, retrying...");
    return createWebSocketFlow(url);
  })
  .collect(message => processRealtimeUpdate(message));`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Animations and Transitions"
          description="Coordinate animations with coroutines and scope functions."
        >
          <CodeBlock
            code={`import { launch, delay } from 'kotlinify-ts/coroutines';
import { asSequence } from 'kotlinify-ts/sequences';

// Staggered list animation
async function animateListItems(items) {
  const job = launch(async function() {
    for (const [index, item] of items.entries()) {
      this.ensureActive(); // Check if cancelled
      await delay(index * 100);
      item.classList.add('fade-in');
    }
  });

  return job;
}

// Coordinated modal animation
async function showModal(modalId) {
  const modal = document.getElementById(modalId);

  modal.classList.add('show');
  await delay(50);

  modal.querySelector('.backdrop').classList.add('visible');
  await delay(200);

  modal.querySelector('.content').classList.add('slide-in');
}

// Sequence of animations with cancellation
const animationJob = launch(async function() {
  await showLoadingSpinner();
  await delay(1000);
  this.ensureActive();
  await fetchData();
  await delay(500);
  this.ensureActive();
  await hideLoadingSpinner();
});

// Cancel if user navigates away
window.addEventListener('beforeunload', () => animationJob.cancel());`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4">
            <Link
              href="/docs/server-side"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
            >
              Server-Side Guide →
            </Link>
            <Link
              href="/docs/api"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors"
            >
              API Reference
            </Link>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}
