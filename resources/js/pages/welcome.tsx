import React, { useState, useRef, useEffect } from 'react';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface ScrollingTextProps {
    text: string;
    speed: number;
    fontSize: number;
    color: string;
    direction: 'left' | 'right' | 'up' | 'down';
    isPlaying: boolean;
}

interface MediaPlayerProps {
    src: string;
    type: 'audio' | 'video';
}

interface ClockProps {
    format: '12h' | '24h';
    showDate: boolean;
    color: string;
}

const ScrollingText: React.FC<ScrollingTextProps> = ({ 
    text, 
    speed, 
    fontSize, 
    color, 
    direction, 
    isPlaying 
}) => {
    const textRef = useRef<HTMLDivElement>(null);
    
    const getAnimationStyle = () => {
        const duration = `${20 - speed}s`;
        
        return {
            animation: isPlaying ? `scroll-${direction} ${duration} linear infinite` : 'none',
            fontSize: `${fontSize}px`,
            color: color,
            whiteSpace: 'nowrap' as const,
            display: 'inline-block',
        };
    };

    return (
        <div className="h-full w-full overflow-hidden relative bg-black/5 dark:bg-white/5 rounded-lg">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll-left {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes scroll-right {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes scroll-up {
                    0% { transform: translateY(100%); }
                    100% { transform: translateY(-100%); }
                }
                @keyframes scroll-down {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                `
            }} />
            <div className="h-full flex items-center justify-start">
                <div ref={textRef} style={getAnimationStyle()}>
                    {text || '📱 Welcome to Multimedia Display App! Customize your scrolling text, play media files, and browse the web! 🎵📹🌐'}
                </div>
            </div>
        </div>
    );
};

const MediaPlayer: React.FC<MediaPlayerProps> = ({ src, type }) => {
    const [error, setError] = useState<string>('');
    
    const handleError = () => {
        setError(`Failed to load ${type} file. Please check the URL or file format.`);
    };
    
    if (!src) {
        return (
            <div className="h-full w-full bg-black/10 dark:bg-white/10 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-600 dark:text-gray-400">
                    <div className="text-4xl mb-2">{type === 'audio' ? '🎵' : '📹'}</div>
                    <p>Enter a {type} URL or upload a file</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="h-full w-full bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <div className="text-center text-red-600 dark:text-red-400">
                    <div className="text-4xl mb-2">⚠️</div>
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="h-full w-full rounded-lg overflow-hidden">
            {type === 'audio' ? (
                <div className="h-full w-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <div className="text-center text-white">
                        <div className="text-6xl mb-4">🎵</div>
                        <audio 
                            controls 
                            className="w-full max-w-md"
                            onError={handleError}
                            preload="metadata"
                        >
                            <source src={src} type="audio/mpeg" />
                            <source src={src} type="audio/wav" />
                            <source src={src} type="audio/ogg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </div>
            ) : (
                <video 
                    controls 
                    className="w-full h-full object-cover"
                    onError={handleError}
                    preload="metadata"
                >
                    <source src={src} type="video/mp4" />
                    <source src={src} type="video/webm" />
                    <source src={src} type="video/ogg" />
                    Your browser does not support the video element.
                </video>
            )}
        </div>
    );
};

const WebBrowser: React.FC<{ url: string }> = ({ url }) => {
    const predefinedSites = [
        { name: 'News', url: 'https://news.ycombinator.com', icon: '📰' },
        { name: 'Weather', url: 'https://weather.com', icon: '🌤️' },
        { name: 'Wikipedia', url: 'https://wikipedia.org', icon: '📚' },
        { name: 'Maps', url: 'https://maps.google.com', icon: '🗺️' },
        { name: 'YouTube', url: 'https://youtube.com', icon: '📺' },
    ];
    
    if (!url) {
        return (
            <div className="h-full w-full bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-center">🌐 Quick Browse</h3>
                <div className="grid grid-cols-1 gap-2">
                    {predefinedSites.map((site) => (
                        <Button
                            key={site.name}
                            variant="outline"
                            className="justify-start"
                            onClick={() => window.open(site.url, '_blank')}
                        >
                            <span className="mr-2">{site.icon}</span>
                            {site.name}
                        </Button>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="h-full w-full rounded-lg overflow-hidden border">
            <iframe 
                src={url} 
                className="w-full h-full border-0"
                title="Web Browser"
                sandbox="allow-scripts allow-same-origin"
            />
        </div>
    );
};

const ClockDisplay: React.FC<ClockProps> = ({ format, showDate, color }) => {
    const [time, setTime] = useState(new Date());
    
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);
    
    const formatTime = (date: Date) => {
        if (format === '12h') {
            return date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
            });
        } else {
            return date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: false 
            });
        }
    };
    
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    return (
        <div className="h-full w-full bg-black/5 dark:bg-white/5 rounded-lg flex flex-col items-center justify-center">
            <div style={{ color }} className="text-center">
                <div className="text-6xl mb-2">🕐</div>
                <div className="text-4xl font-mono font-bold mb-2">
                    {formatTime(time)}
                </div>
                {showDate && (
                    <div className="text-lg opacity-80">
                        {formatDate(time)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    
    // Scrolling text settings
    const [scrollText, setScrollText] = useState('');
    const [scrollSpeed, setScrollSpeed] = useState([10]);
    const [scrollFontSize, setScrollFontSize] = useState([32]);
    const [scrollColor, setScrollColor] = useState('#3b82f6');
    const [scrollDirection, setScrollDirection] = useState<'left' | 'right' | 'up' | 'down'>('left');
    const [isScrolling, setIsScrolling] = useState(false);
    
    // Media player settings
    const [audioSrc, setAudioSrc] = useState('');
    const [videoSrc, setVideoSrc] = useState('');
    
    // Browser settings
    const [browserUrl, setBrowserUrl] = useState('');
    
    // Clock settings
    const [clockFormat, setClockFormat] = useState<'12h' | '24h'>('12h');
    const [showDate, setShowDate] = useState(true);
    const [clockColor, setClockColor] = useState('#059669');
    
    // Split screen settings
    const [splitMode, setSplitMode] = useState(false);
    const [leftPanel, setLeftPanel] = useState('text');
    const [rightPanel, setRightPanel] = useState('clock');
    
    const renderPanel = (panelType: string) => {
        switch (panelType) {
            case 'text':
                return (
                    <ScrollingText
                        text={scrollText}
                        speed={scrollSpeed[0]}
                        fontSize={scrollFontSize[0]}
                        color={scrollColor}
                        direction={scrollDirection}
                        isPlaying={isScrolling}
                    />
                );
            case 'audio':
                return <MediaPlayer src={audioSrc} type="audio" />;
            case 'video':
                return <MediaPlayer src={videoSrc} type="video" />;
            case 'browser':
                return <WebBrowser url={browserUrl} />;
            case 'clock':
                return (
                    <ClockDisplay 
                        format={clockFormat}
                        showDate={showDate}
                        color={clockColor}
                    />
                );
            default:
                return (
                    <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-2">📱</div>
                            <p>Select a panel type</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <Head title="Multimedia Display App">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900">
                {/* Header */}
                <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">📱</div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Multimedia Display
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Interactive media & text display platform
                                    </p>
                                </div>
                            </div>
                            <nav className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link href={route('dashboard')}>
                                        <Button variant="outline">Dashboard</Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')}>
                                            <Button variant="ghost">Log in</Button>
                                        </Link>
                                        <Link href={route('register')}>
                                            <Button>Register</Button>
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Feature Overview */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                            <Badge variant="secondary">🎬 Media Player</Badge>
                            <Badge variant="secondary">📜 Scrolling Text</Badge>
                            <Badge variant="secondary">🌐 Web Browser</Badge>
                            <Badge variant="secondary">🕐 Live Clock</Badge>
                        </div>
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            All-in-One Display Solution
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Create dynamic displays with customizable scrolling text, media playback, split-screen views, 
                            integrated web browsing, and real-time clock. Perfect for presentations, digital signage, or entertainment.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Controls Panel */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        ⚙️ Controls
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Tabs defaultValue="display" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="display">Display</TabsTrigger>
                                            <TabsTrigger value="content">Content</TabsTrigger>
                                        </TabsList>
                                        
                                        <TabsContent value="display" className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label>Split Screen Mode</Label>
                                                <Switch 
                                                    checked={splitMode} 
                                                    onCheckedChange={setSplitMode}
                                                />
                                            </div>
                                            
                                            {splitMode ? (
                                                <div className="space-y-3">
                                                    <div>
                                                        <Label>Left Panel</Label>
                                                        <Select value={leftPanel} onChange={(e) => setLeftPanel(e.target.value)}>
                                                            <SelectContent>
                                                                <SelectItem value="text">📜 Scrolling Text</SelectItem>
                                                                <SelectItem value="audio">🎵 Audio Player</SelectItem>
                                                                <SelectItem value="video">📹 Video Player</SelectItem>
                                                                <SelectItem value="browser">🌐 Web Browser</SelectItem>
                                                                <SelectItem value="clock">🕐 Clock</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label>Right Panel</Label>
                                                        <Select value={rightPanel} onChange={(e) => setRightPanel(e.target.value)}>
                                                            <SelectContent>
                                                                <SelectItem value="text">📜 Scrolling Text</SelectItem>
                                                                <SelectItem value="audio">🎵 Audio Player</SelectItem>
                                                                <SelectItem value="video">📹 Video Player</SelectItem>
                                                                <SelectItem value="browser">🌐 Web Browser</SelectItem>
                                                                <SelectItem value="clock">🕐 Clock</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Label>Display Mode</Label>
                                                    <Select value={leftPanel} onChange={(e) => setLeftPanel(e.target.value)}>
                                                        <SelectContent>
                                                            <SelectItem value="text">📜 Scrolling Text</SelectItem>
                                                            <SelectItem value="audio">🎵 Audio Player</SelectItem>
                                                            <SelectItem value="video">📹 Video Player</SelectItem>
                                                            <SelectItem value="browser">🌐 Web Browser</SelectItem>
                                                            <SelectItem value="clock">🕐 Clock</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                        </TabsContent>
                                        
                                        <TabsContent value="content" className="space-y-4">
                                            {/* Scrolling Text Controls */}
                                            <div className="space-y-3">
                                                <Label>📜 Scrolling Text</Label>
                                                <Textarea 
                                                    placeholder="Enter your scrolling text message..."
                                                    value={scrollText}
                                                    onChange={(e) => setScrollText(e.target.value)}
                                                />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <Label className="text-xs">Speed: {scrollSpeed[0]}</Label>
                                                        <Slider
                                                            value={scrollSpeed}
                                                            onValueChange={setScrollSpeed}
                                                            min={1}
                                                            max={20}
                                                            step={1}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Size: {scrollFontSize[0]}px</Label>
                                                        <Slider
                                                            value={scrollFontSize}
                                                            onValueChange={setScrollFontSize}
                                                            min={12}
                                                            max={72}
                                                            step={2}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <Label className="text-xs">Color</Label>
                                                        <Input
                                                            type="color"
                                                            value={scrollColor}
                                                            onChange={(e) => setScrollColor(e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Direction</Label>
                                                        <Select value={scrollDirection} onChange={(e) => setScrollDirection(e.target.value as 'left' | 'right' | 'up' | 'down')}>
                                                            <SelectContent>
                                                                <SelectItem value="left">← Left</SelectItem>
                                                                <SelectItem value="right">→ Right</SelectItem>
                                                                <SelectItem value="up">↑ Up</SelectItem>
                                                                <SelectItem value="down">↓ Down</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <Button 
                                                    onClick={() => setIsScrolling(!isScrolling)}
                                                    variant={isScrolling ? "destructive" : "default"}
                                                    className="w-full"
                                                >
                                                    {isScrolling ? 'Stop' : 'Start'} Scrolling
                                                </Button>
                                            </div>

                                            {/* Media Controls */}
                                            <div className="space-y-3">
                                                <Label>🎵 Audio URL/File</Label>
                                                <Input 
                                                    placeholder="https://example.com/audio.mp3"
                                                    value={audioSrc}
                                                    onChange={(e) => setAudioSrc(e.target.value)}
                                                />
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <Label>📹 Video URL/File</Label>
                                                <Input 
                                                    placeholder="https://example.com/video.mp4"
                                                    value={videoSrc}
                                                    onChange={(e) => setVideoSrc(e.target.value)}
                                                />
                                            </div>

                                            {/* Browser Controls */}
                                            <div className="space-y-3">
                                                <Label>🌐 Website URL</Label>
                                                <Input 
                                                    placeholder="https://example.com"
                                                    value={browserUrl}
                                                    onChange={(e) => setBrowserUrl(e.target.value)}
                                                />
                                            </div>

                                            {/* Clock Controls */}
                                            <div className="space-y-3">
                                                <Label>🕐 Clock Settings</Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Select value={clockFormat} onChange={(e) => setClockFormat(e.target.value as '12h' | '24h')}>
                                                        <SelectContent>
                                                            <SelectItem value="12h">12 Hour</SelectItem>
                                                            <SelectItem value="24h">24 Hour</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Input
                                                        type="color"
                                                        value={clockColor}
                                                        onChange={(e) => setClockColor(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs">Show Date</Label>
                                                    <Switch 
                                                        checked={showDate} 
                                                        onCheckedChange={setShowDate}
                                                    />
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Display Area */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        📺 Live Display
                                        {splitMode && <Badge variant="outline">Split Screen</Badge>}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className={`${splitMode ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''} h-96`}>
                                        <div className={splitMode ? 'h-full' : 'h-full'}>
                                            {renderPanel(leftPanel)}
                                        </div>
                                        {splitMode && (
                                            <div className="h-full">
                                                {renderPanel(rightPanel)}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center">
                            <CardContent className="p-6">
                                <div className="text-4xl mb-3">📜</div>
                                <h3 className="font-semibold mb-2">Scrolling Text</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Customize speed, direction, font size, and color for dynamic text displays
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card className="text-center">
                            <CardContent className="p-6">
                                <div className="text-4xl mb-3">🎬</div>
                                <h3 className="font-semibold mb-2">Media Player</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Play MP3 audio and MP4 video files from URLs or local storage
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card className="text-center">
                            <CardContent className="p-6">
                                <div className="text-4xl mb-3">🌐</div>
                                <h3 className="font-semibold mb-2">Web Browser</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Integrated browser with quick access to predefined websites
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card className="text-center">
                            <CardContent className="p-6">
                                <div className="text-4xl mb-3">🕐</div>
                                <h3 className="font-semibold mb-2">Live Clock</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Real-time clock with customizable format and date display
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-16 border-t bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Built with ❤️ by{" "}
                            <a 
                                href="https://app.build" 
                                target="_blank" 
                                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                            >
                                app.build
                            </a>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}