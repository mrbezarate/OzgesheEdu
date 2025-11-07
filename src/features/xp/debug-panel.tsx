"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface XpDebugPanelProps {
  bonusXp: number;
  onBoost: (amount: number) => void;
  onReset: () => void;
}

export const XpDebugPanel: React.FC<XpDebugPanelProps> = ({ bonusXp, onBoost, onReset }) => {
  const [value, setValue] = useState(100);

  const handleBoost = () => {
    const normalized = Number.isFinite(value) ? value : 0;
    onBoost(Math.max(10, normalized));
  };

  return (
    <Card className="border-dashed border-primary/40 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">XP Debug Tool</CardTitle>
        <CardDescription>Temporarily add XP to preview progression (dev only)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">Current debug bonus: {bonusXp} XP</p>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            type="number"
            className="w-32"
            min={10}
            step={10}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
          />
          <Button type="button" onClick={handleBoost}>
            Add XP
          </Button>
          <Button type="button" variant="ghost" onClick={onReset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
