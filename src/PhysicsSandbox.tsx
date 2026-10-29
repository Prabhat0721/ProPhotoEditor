import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Box, Circle, Trash2, RefreshCw, Plus, MousePointer2 } from 'lucide-react';

const PhysicsSandbox: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>(Matter.Engine.create());
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [shapeType, setShapeType] = useState<'rect' | 'circle'>('rect');

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = engineRef.current;
    const { world } = engine;

    // Create renderer
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: sceneRef.current.clientHeight,
        wireframes: false,
        background: '#0f1117',
      },
    });
    renderRef.current = render;

    // Create runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Create boundaries
    const thickness = 60;
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    const ground = Matter.Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { 
      isStatic: true,
      render: { fillStyle: '#1e2230' }
    });
    const leftWall = Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { 
      isStatic: true,
      render: { fillStyle: '#1e2230' }
    });
    const rightWall = Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { 
      isStatic: true,
      render: { fillStyle: '#1e2230' }
    });
    const ceiling = Matter.Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { 
      isStatic: true,
      render: { fillStyle: '#1e2230' }
    });

    Matter.World.add(world, [ground, leftWall, rightWall, ceiling]);

    // Add mouse control
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Matter.World.add(world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Handle window resize
    const handleResize = () => {
      if (!sceneRef.current || !renderRef.current) return;
      const newWidth = sceneRef.current.clientWidth;
      const newHeight = sceneRef.current.clientHeight;

      renderRef.current.canvas.width = newWidth;
      renderRef.current.canvas.height = newHeight;

      Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + thickness / 2 });
      Matter.Body.setPosition(rightWall, { x: newWidth + thickness / 2, y: newHeight / 2 });
      // Update other boundaries if needed
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  const addShape = (x: number, y: number) => {
    const { world } = engineRef.current;
    const size = Math.random() * 40 + 20;
    const color = ['#0ea5e9', '#38bdf8', '#0284c7', '#7dd3fc'][Math.floor(Math.random() * 4)];
    
    let body;
    if (shapeType === 'rect') {
      body = Matter.Bodies.rectangle(x, y, size, size, {
        render: { fillStyle: color },
        friction: 0.1,
        restitution: 0.5,
      });
    } else {
      body = Matter.Bodies.circle(x, y, size / 2, {
        render: { fillStyle: color },
        friction: 0.1,
        restitution: 0.5,
      });
    }
    
    Matter.World.add(world, body);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (rect) {
      addShape(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const clearCanvas = () => {
    const { world } = engineRef.current;
    const bodies = Matter.Composite.allBodies(world);
    const nonStaticBodies = bodies.filter(body => !body.isStatic);
    Matter.World.remove(world, nonStaticBodies);
  };

  return (
    <div className="flex flex-col h-full bg-dark-900 text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700 bg-dark-800/50">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Plus className="text-brand-500" />
          Physics Sandbox
        </h2>
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-slate-400 hover:text-red-400"
            title="Clear all"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-slate-400"
            title="Reset"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={sceneRef} 
        className="flex-1 cursor-crosshair relative"
        onClick={handleCanvasClick}
      >
        <div className="absolute top-4 left-4 pointer-events-none text-slate-500 text-sm">
          Click anywhere to spawn shapes. Drag them around!
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-dark-800 border-t border-dark-700 pb-safe">
        <div className="flex justify-center gap-6">
          <button
            onClick={() => setShapeType('rect')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
              shapeType === 'rect' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-dark-700 text-slate-400'
            }`}
          >
            <Box size={24} />
            <span className="text-xs font-bold uppercase tracking-wider">Rectangle</span>
          </button>
          <button
            onClick={() => setShapeType('circle')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
              shapeType === 'circle' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-dark-700 text-slate-400'
            }`}
          >
            <Circle size={24} />
            <span className="text-xs font-bold uppercase tracking-wider">Circle</span>
          </button>
          <div className="w-px bg-dark-600 self-stretch" />
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-slate-500">
            <MousePointer2 size={24} />
            <span className="text-xs font-bold uppercase tracking-wider">Interact</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsSandbox;
