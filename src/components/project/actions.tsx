// src/components/project/actions.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Sparkles, Video, ImageIcon, MessageCircle } from 'lucide-react';

export function ProjectActions({ projectId }: { projectId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleAnalyze = async () => {
    setIsLoading(true);
    setStatus('🔍 Analyzing website...');
    try {
      const response = await fetch(`/api/projects/${projectId}/analyze`, {
        method: 'POST',
      });
      const data = await response.json();
      setStatus(`✅ Analysis started (ID: ${data.generationId})`);
    } catch (error) {
      setStatus('❌ Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="font-bold">Campaign Generation</h3>
        <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-5">
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            variant="outline"
            className="gap-2"
          >
            <Zap className="h-4 w-4" />
            <span>Analyze</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Photoshoot</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Ads</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Video className="h-4 w-4" />
            <span>Videos</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Agent</span>
          </Button>
        </div>
        {status && (
          <p className="text-sm text-muted-foreground">{status}</p>
        )}
      </div>
    </Card>
  );
}
