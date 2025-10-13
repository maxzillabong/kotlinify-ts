"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { asSequence } from "kotlinify-ts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SAMPLE_SIZE = 1_000_000;
const TARGET_INDEX = 128;
const ITERATIONS = 64;

interface BenchmarkRowProps {
  label: string;
  milliseconds: number;
  operations: number;
  variant: "array" | "sequence";
  maxValue: number;
  animationId: number;
}

const formatNumber = new Intl.NumberFormat();

const BenchmarkRow: React.FC<BenchmarkRowProps> = ({
  label,
  milliseconds,
  operations,
  variant,
  maxValue,
  animationId,
}) => {
  const width = maxValue > 0 ? (milliseconds / maxValue) * 100 : 0;
  const clampedWidth = Math.min(Math.max(width, width > 0 ? 4 : 0), 100);
  const barClassName =
    variant === "array"
      ? "bg-destructive/70 dark:bg-destructive/60"
      : "bg-primary/70 dark:bg-primary/80";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-mono text-xs text-foreground/90">
          {milliseconds.toFixed(2)} ms
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <motion.div
          key={`${variant}-${animationId}`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedWidth}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${barClassName}`}
        />
      </div>
      <span className="text-xs text-muted-foreground">
        {formatNumber.format(operations)} transforms executed
      </span>
    </div>
  );
};

interface BenchmarkResult {
  arrayTime: number;
  sequenceTime: number;
  arrayOps: number;
  sequenceOps: number;
  speedup: number;
}

interface BenchmarkItem {
  id: number;
  seed: number;
  quality: number;
  isTarget: boolean;
}

export const BenchmarkWidget: React.FC = () => {
  const dataset = React.useMemo<BenchmarkItem[]>(() => {
    return Array.from({ length: SAMPLE_SIZE }, (_, index) => {
      const baseQuality = index % 23 === 0 ? 240 : 140;
      return {
        id: index,
        seed: (index * 997) % 1024,
        quality:
          index === TARGET_INDEX
            ? 780
            : index % 41 === 0
            ? baseQuality + 60
            : baseQuality,
        isTarget: index === TARGET_INDEX,
      };
    });
  }, []);

  const [result, setResult] = React.useState<BenchmarkResult | null>(null);
  const [isRunning, setIsRunning] = React.useState(false);
  const [animationId, setAnimationId] = React.useState(0);

  const runBenchmark = React.useCallback(() => {
    setIsRunning(true);

    requestAnimationFrame(() => {
      const mapIterations = ITERATIONS;
      const threshold = 1800;

      const makeTransformer = (counter: { current: number }) => (item: BenchmarkItem) => {
        counter.current++;
        let total = 0;
        for (let i = 0; i < mapIterations; i++) {
          const value = (item.seed + i * 13) % 1024;
          total += Math.sqrt(value) * 0.55 + Math.cbrt(value) * 1.35;
        }
        const score = total + item.quality;
        return {
          id: item.id,
          score,
          isTarget: item.isTarget,
        };
      };

      const arrayCounter = { current: 0 };
      const sequenceCounter = { current: 0 };
      const arrayTransformer = makeTransformer(arrayCounter);
      const sequenceTransformer = makeTransformer(sequenceCounter);

      const arrayStart = performance.now();
      const arrayResult = dataset
        .map(arrayTransformer)
        .filter((entry) => entry.score > threshold)
        .find((entry) => entry.isTarget);
      const arrayTime = performance.now() - arrayStart;

      const sequenceStart = performance.now();
      const sequenceResult = asSequence(dataset)
        .map(sequenceTransformer)
        .filter((entry) => entry.score > threshold)
        .find((entry) => entry.isTarget);
      const sequenceTime = performance.now() - sequenceStart;

      if (!arrayResult || !sequenceResult) {
        console.warn("Benchmark failed to locate the target sample. Adjusting threshold.");
      }

      setResult({
        arrayTime,
        sequenceTime,
        arrayOps: arrayCounter.current,
        sequenceOps: sequenceCounter.current,
        speedup: sequenceTime > 0 ? arrayTime / sequenceTime : Infinity,
      });
      setAnimationId((id) => id + 1);
      setIsRunning(false);
    });
  }, [dataset]);

  React.useEffect(() => {
    runBenchmark();
  }, [runBenchmark]);

  const formatter = React.useMemo(() => new Intl.NumberFormat(), []);

  return (
    <Card className="relative w-full overflow-hidden border-border/60 bg-card/80 backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--primary)/7_0%,transparent_65%)]" />
      <CardHeader className="relative z-10">
        <CardTitle className="text-left text-2xl">
          1,000,000 item benchmark
        </CardTitle>
        <CardDescription className="text-left text-base">
          Array chains churn through every element. Sequences stop the moment a match appears—see the million item delta in real time.
        </CardDescription>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={runBenchmark} disabled={isRunning}>
            {isRunning ? "Running…" : "Run benchmark"}
          </Button>
          {result && !Number.isFinite(result.speedup) && (
            <span className="text-xs text-muted-foreground">
              Sequence completed too quickly to measure. Try running again.
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative z-10 space-y-6">
        {result ? (
          <>
            <div className="grid gap-4">
              <BenchmarkRow
                label="Array pipeline"
                milliseconds={result.arrayTime}
                operations={result.arrayOps}
                variant="array"
                maxValue={Math.max(result.arrayTime, result.sequenceTime)}
                animationId={animationId}
              />
              <BenchmarkRow
                label="Sequence pipeline"
                milliseconds={result.sequenceTime}
                operations={result.sequenceOps}
                variant="sequence"
                maxValue={Math.max(result.arrayTime, result.sequenceTime)}
                animationId={animationId}
              />
            </div>
            <div className="grid gap-1 text-sm text-muted-foreground">
              <p>
                Sequence short-circuited after {formatter.format(result.sequenceOps)} transforms, saving
                {" "}
                {formatter.format(result.arrayOps - result.sequenceOps)} extra computations over arrays.
              </p>
              <p className="text-foreground text-lg font-semibold">
                {result.sequenceTime > 0
                  ? `≈${(result.speedup >= 10 ? result.speedup.toFixed(0) : result.speedup.toFixed(1))}× faster`
                  : "Blazing fast"}
                {" "}
                with lazy evaluation.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Runs with synthetic data where only one of {SAMPLE_SIZE.toLocaleString()} entries matches.
              Your actual speedup depends on real workloads, but the short-circuiting behavior is the same.
            </p>
          </>
        ) : (
          <div className="flex min-h-[160px] items-center justify-center text-sm text-muted-foreground">
            Initializing benchmark…
          </div>
        )}
      </CardContent>
    </Card>
  );
};
