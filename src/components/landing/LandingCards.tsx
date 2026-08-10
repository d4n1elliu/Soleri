import { motion, type Variants } from 'framer-motion';
import type { Feature, Step } from './LandingData';

export function FeatureCard({ feature, variants }: { feature: Feature; variants: Variants }) {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group flex flex-col rounded-2xl bg-zinc-900 p-8 ring-1 ring-zinc-800 transition-colors hover:ring-zinc-700 hover:bg-zinc-900/90"
    >
      <div className="mb-5 h-px w-10 bg-green-500 transition-all duration-300 group-hover:w-16" />
      <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
        {feature.title}
      </h3>
      <p className="mt-2 text-sm font-medium text-zinc-300">{feature.desc}</p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-500">{feature.detail}</p>
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