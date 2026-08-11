import { motion, type Variants } from 'framer-motion';
import type { Feature, Step } from './LandingData';

export function FeatureCard({ feature, index, variants }: { feature: Feature; index: number; variants: Variants }) {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -4 }}
      className="flex flex-col justify-between rounded-3xl border border-zinc-800/80 bg-zinc-900/30 p-8 backdrop-blur-xl"
    >
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          {String(index + 1).padStart(2, '0')} / {feature.tag}
        </span>
        <h3 className="mt-4 text-xl font-normal text-white">{feature.title}</h3>
        <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{feature.desc}</p>
      </div>

      <div className="mt-8 border-t border-zinc-800/60 pt-6">
        <p className={`text-3xl font-light ${feature.stat.accent ? 'text-emerald-400' : 'text-white'}`}>
          {feature.stat.value}
          {feature.stat.unit && <span className="text-sm font-normal text-zinc-400"> {feature.stat.unit}</span>}
        </p>
        <p className="mt-1 text-[11px] font-medium tracking-wide uppercase text-zinc-500">{feature.stat.label}</p>
      </div>
    </motion.div>
  );
}

export function StepCard({ step, variants }: { step: Step; variants: Variants }) {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -4 }}
      className="relative flex flex-col rounded-2xl bg-zinc-900 p-8 ring-1 ring-zinc-800 transition-colors hover:ring-zinc-700"
    >
      <span className="text-5xl font-black text-zinc-800 leading-none select-none">
        {step.step}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{step.desc}</p>
      <p className="mt-4 text-xs font-medium text-green-500">{step.detail}</p>
    </motion.div>
  );
}