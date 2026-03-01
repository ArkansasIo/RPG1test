(function() {
  "use strict";

  var platforms = {
    gb: {
      id: 'gb', name: 'Game Boy (DMG)', bits: 8, cpu: 'Sharp LR35902 (Z80-like)',
      clockSpeed: '4.19 MHz', resolution: '160x144', resW: 160, resH: 144,
      colors: '4 shades of green', maxColors: 4, colorFormat: '2-bit',
      vram: '8 KB', vramBytes: 8192, vramBanks: 1,
      wram: '8 KB', wramBytes: 8192, wramBanks: 2,
      soundChannels: 4, soundDesc: 'Square x2 + Wave + Noise',
      maxRom: '2 MB', maxRomBytes: 2097152,
      tileFormat: '2BPP', tileSize: 8, bpp: 2, maxSprites: 40, spriteSizes: ['8x8', '8x16'],
      features: ['Bank Switching (MBC)', 'DMA Transfer', 'Window Layer', 'BG Scrolling', 'Timer', 'Serial Link'],
      graphicsModes: ['BG Layer', 'Window Layer', 'OAM Sprites'],
      fileExtension: '.gb',
      memoryMap: {
        'ROM Bank 0': { start: '0x0000', end: '0x3FFF', size: '16 KB', desc: 'Fixed ROM bank' },
        'ROM Bank N': { start: '0x4000', end: '0x7FFF', size: '16 KB', desc: 'Switchable ROM bank' },
        'VRAM': { start: '0x8000', end: '0x9FFF', size: '8 KB', desc: 'Video RAM (tiles + maps)' },
        'External RAM': { start: '0xA000', end: '0xBFFF', size: '8 KB', desc: 'Cart SRAM (battery-backed)' },
        'WRAM': { start: '0xC000', end: '0xDFFF', size: '8 KB', desc: 'Work RAM' },
        'OAM': { start: '0xFE00', end: '0xFE9F', size: '160 B', desc: 'Sprite attribute table (40 sprites x 4 bytes)' },
        'I/O Registers': { start: '0xFF00', end: '0xFF7F', size: '128 B', desc: 'Hardware I/O' },
        'HRAM': { start: '0xFF80', end: '0xFFFE', size: '127 B', desc: 'High RAM (fast access)' }
      },
      registers: ['A', 'F', 'B', 'C', 'D', 'E', 'H', 'L', 'SP', 'PC', 'AF', 'BC', 'DE', 'HL'],
      audioSpec: { ch1: 'Square + Sweep', ch2: 'Square', ch3: 'Wave (4-bit, 32 samples)', ch4: 'Noise (LFSR)' },
      buildTools: { compiler: 'GBDK-2020 lcc', path: '~/gbdk/bin/lcc', flags: '-Wm-yt0x00 -Wl-yo4 -Wl-ya1', sdk: 'GBDK-2020', sdkUrl: 'https://github.com/gbdk-2020/gbdk-2020' },
      romSizes: ['32 KB (2 banks)', '64 KB (4 banks)', '128 KB (8 banks)', '256 KB (16 banks)', '512 KB (32 banks)', '1 MB (64 banks)', '2 MB (128 banks)'],
      cartTypes: ['ROM Only', 'MBC1', 'MBC1+RAM', 'MBC1+RAM+BATTERY', 'MBC3+RAM+BATTERY', 'MBC5', 'MBC5+RAM', 'MBC5+RAM+BATTERY'],
      sramSizes: ['None', '8 KB (1 bank)', '32 KB (4 banks)']
    },
    gbc: {
      id: 'gbc', name: 'Game Boy Color', bits: 8, cpu: 'Sharp LR35902 (Z80-like)',
      clockSpeed: '4.19 / 8.38 MHz (double speed)', resolution: '160x144', resW: 160, resH: 144,
      colors: '56 colors on screen', maxColors: 32768, colorFormat: 'RGB555',
      vram: '16 KB (2 banks)', vramBytes: 16384, vramBanks: 2,
      wram: '32 KB (8 banks)', wramBytes: 32768, wramBanks: 8,
      soundChannels: 4, soundDesc: 'Square x2 + Wave + Noise',
      maxRom: '8 MB', maxRomBytes: 8388608,
      tileFormat: '2BPP', tileSize: 8, bpp: 2, maxSprites: 40, spriteSizes: ['8x8', '8x16'],
      features: ['Bank Switching (MBC)', 'Double Speed Mode', 'VRAM Bank Switching', 'WRAM Bank Switching', 'DMA Transfer', 'HDMA', 'BG/OBJ Palettes (8 each)', 'Window Layer', 'BG Scrolling', 'Timer', 'Serial Link', 'Infrared'],
      graphicsModes: ['BG Layer (w/ attributes)', 'Window Layer', 'OAM Sprites', 'BG Priority per-tile'],
      fileExtension: '.gbc',
      memoryMap: {
        'ROM Bank 0': { start: '0x0000', end: '0x3FFF', size: '16 KB', desc: 'Fixed ROM bank' },
        'ROM Bank N': { start: '0x4000', end: '0x7FFF', size: '16 KB', desc: 'Switchable ROM bank (up to 511)' },
        'VRAM Bank 0/1': { start: '0x8000', end: '0x9FFF', size: '8 KB x2', desc: 'Video RAM (2 banks)' },
        'External RAM': { start: '0xA000', end: '0xBFFF', size: '8 KB', desc: 'Cart SRAM (switchable banks)' },
        'WRAM Bank 0': { start: '0xC000', end: '0xCFFF', size: '4 KB', desc: 'Work RAM (fixed)' },
        'WRAM Bank 1-7': { start: '0xD000', end: '0xDFFF', size: '4 KB', desc: 'Work RAM (switchable)' },
        'OAM': { start: '0xFE00', end: '0xFE9F', size: '160 B', desc: 'Sprite attribute table' },
        'I/O Registers': { start: '0xFF00', end: '0xFF7F', size: '128 B', desc: 'Hardware I/O + GBC registers' },
        'HRAM': { start: '0xFF80', end: '0xFFFE', size: '127 B', desc: 'High RAM' }
      },
      registers: ['A', 'F', 'B', 'C', 'D', 'E', 'H', 'L', 'SP', 'PC', 'AF', 'BC', 'DE', 'HL'],
      audioSpec: { ch1: 'Square + Sweep', ch2: 'Square', ch3: 'Wave (4-bit, 32 samples)', ch4: 'Noise (LFSR)' },
      buildTools: { compiler: 'GBDK-2020 lcc', path: '~/gbdk/bin/lcc', flags: '-Wm-yC -Wm-yt0x1B -Wl-yo32 -Wl-ya4', sdk: 'GBDK-2020', sdkUrl: 'https://github.com/gbdk-2020/gbdk-2020' },
      romSizes: ['256 KB (16 banks)', '512 KB (32 banks)', '1 MB (64 banks)', '2 MB (128 banks)', '4 MB (256 banks)', '8 MB (512 banks)'],
      cartTypes: ['MBC1', 'MBC1+RAM+BATTERY', 'MBC3+RAM+BATTERY', 'MBC5', 'MBC5+RAM', 'MBC5+RAM+BATTERY'],
      sramSizes: ['None', '8 KB (1 bank)', '32 KB (4 banks)', '128 KB (16 banks)']
    },
    gba: {
      id: 'gba', name: 'Game Boy Advance', bits: 16, cpu: 'ARM7TDMI',
      clockSpeed: '16.78 MHz', resolution: '240x160', resW: 240, resH: 160,
      colors: '32768 colors (15-bit)', maxColors: 32768, colorFormat: 'RGB555',
      vram: '96 KB', vramBytes: 98304, vramBanks: 1,
      wram: '256 KB EWRAM + 32 KB IWRAM', wramBytes: 294912, wramBanks: 1,
      soundChannels: 6, soundDesc: '4 legacy (GB) + 2 Direct Sound (DMA, 8-bit PCM)',
      maxRom: '32 MB', maxRomBytes: 33554432,
      tileFormat: '4BPP / 8BPP', tileSize: 8, bpp: 4, maxSprites: 128, spriteSizes: ['8x8','16x16','32x32','64x64','8x16','16x8','16x32','32x16','32x64','64x32'],
      features: ['No Bank Switching', 'DMA Transfer (4 channels)', 'Affine/Rotation BG', 'Mode 7 Effects', 'Alpha Blending', 'Mosaic Effect', 'Windowing (2 windows)', 'Hardware Timers (4)', 'Serial/Multiplayer Link', 'Thumb Instruction Set', 'Bitmap Modes (3-5)', 'HBlank/VBlank IRQ', 'Key Input IRQ'],
      graphicsModes: ['Mode 0: 4 tile BG layers', 'Mode 1: 2 tile + 1 affine BG', 'Mode 2: 2 affine BG layers', 'Mode 3: 240x160 bitmap (15-bit)', 'Mode 4: 240x160 bitmap (8-bit, 2 pages)', 'Mode 5: 160x128 bitmap (15-bit, 2 pages)'],
      fileExtension: '.gba',
      memoryMap: {
        'System ROM': { start: '0x00000000', end: '0x00003FFF', size: '16 KB', desc: 'BIOS (protected)' },
        'EWRAM': { start: '0x02000000', end: '0x0203FFFF', size: '256 KB', desc: 'External Work RAM' },
        'IWRAM': { start: '0x03000000', end: '0x03007FFF', size: '32 KB', desc: 'Internal Work RAM (fast, 32-bit bus)' },
        'I/O Registers': { start: '0x04000000', end: '0x040003FF', size: '1 KB', desc: 'Hardware registers' },
        'Palette RAM': { start: '0x05000000', end: '0x050003FF', size: '1 KB', desc: 'BG + OBJ palettes (256 + 256 colors)' },
        'VRAM': { start: '0x06000000', end: '0x06017FFF', size: '96 KB', desc: 'Video RAM (tiles, maps, bitmaps)' },
        'OAM': { start: '0x07000000', end: '0x070003FF', size: '1 KB', desc: '128 sprites (8 bytes each)' },
        'ROM (Wait State 0)': { start: '0x08000000', end: '0x09FFFFFF', size: '32 MB', desc: 'Game Pak ROM' },
        'Cart SRAM': { start: '0x0E000000', end: '0x0E00FFFF', size: '64 KB', desc: 'Save RAM / Flash' }
      },
      registers: ['R0-R12', 'SP (R13)', 'LR (R14)', 'PC (R15)', 'CPSR', 'SPSR'],
      audioSpec: { ch1: 'Square + Sweep (legacy)', ch2: 'Square (legacy)', ch3: 'Wave (legacy)', ch4: 'Noise (legacy)', dmaA: 'Direct Sound A (8-bit PCM, DMA1/2)', dmaB: 'Direct Sound B (8-bit PCM, DMA1/2)' },
      buildTools: { compiler: 'devkitARM gcc', path: '$DEVKITARM/bin/arm-none-eabi-gcc', flags: '-mthumb -mthumb-interwork -O2', sdk: 'devkitPro (libtonc/libgba)', sdkUrl: 'https://devkitpro.org/' },
      romSizes: ['1 MB', '2 MB', '4 MB', '8 MB', '16 MB', '32 MB'],
      cartTypes: ['ROM Only', 'ROM + SRAM', 'ROM + Flash 64KB', 'ROM + Flash 128KB', 'ROM + EEPROM 512B', 'ROM + EEPROM 8KB'],
      sramSizes: ['None', '32 KB SRAM', '64 KB Flash', '128 KB Flash', '512 B EEPROM', '8 KB EEPROM']
    },
    nds: {
      id: 'nds', name: 'Nintendo DS', bits: 32, cpu: 'ARM946E-S + ARM7TDMI',
      clockSpeed: '67 MHz (ARM9) + 33 MHz (ARM7)', resolution: '256x192 x2 (dual screen)', resW: 256, resH: 384,
      colors: '262144 colors (18-bit)', maxColors: 262144, colorFormat: 'RGB555 + alpha',
      vram: '656 KB (9 banks: A-I)', vramBytes: 671744, vramBanks: 9,
      wram: '4 MB main + 64 KB ARM7', wramBytes: 4259840, wramBanks: 1,
      soundChannels: 16, soundDesc: '16 channels (PCM8, PCM16, IMA-ADPCM, PSG)',
      maxRom: '512 MB', maxRomBytes: 536870912,
      tileFormat: '4BPP / 8BPP / Direct Color', tileSize: 8, bpp: 8, maxSprites: 128, spriteSizes: ['8x8','16x16','32x32','64x64','8x16','16x8','16x32','32x16','32x64','64x32'],
      features: ['Dual Screen', 'Touchscreen (bottom)', 'Microphone', 'Wifi (802.11b)', '3D Engine (vertices, polygons, textures)', 'Dual CPU', 'DMA (4 channels per CPU)', 'Hardware Divide/Sqrt', '8 Timers (4 per CPU)', 'Extended Palettes', 'Capture/Display Swap', 'Alpha Blending', 'Bitmap BG Modes', 'Affine BG with large maps', 'GBA Slot (Slot-2)'],
      graphicsModes: ['2D: Mode 0-5 (per screen, like GBA)', '3D: OpenGL ES-like (top screen)', 'Extended Rotation', 'Large Bitmap BG', 'Display Capture', 'Video/Direct Bitmap'],
      fileExtension: '.nds',
      memoryMap: {
        'ARM9 ITCM': { start: '0x01000000', end: '0x01007FFF', size: '32 KB', desc: 'Instruction TCM (fastest)' },
        'Main RAM': { start: '0x02000000', end: '0x023FFFFF', size: '4 MB', desc: 'Shared main memory' },
        'ARM9 DTCM': { start: '0x027C0000', end: '0x027C3FFF', size: '16 KB', desc: 'Data TCM (stack)' },
        'I/O Registers': { start: '0x04000000', end: '0x04FFFFFF', size: '~', desc: 'ARM9 + ARM7 I/O' },
        'Palette RAM': { start: '0x05000000', end: '0x050007FF', size: '2 KB', desc: 'BG + OBJ palettes (per engine)' },
        'VRAM': { start: '0x06000000', end: '0x068A3FFF', size: '656 KB', desc: 'Video RAM (9 configurable banks A-I)' },
        'OAM': { start: '0x07000000', end: '0x070007FF', size: '2 KB', desc: '128 sprites per engine' },
        'GBA ROM Slot': { start: '0x08000000', end: '0x09FFFFFF', size: '32 MB', desc: 'GBA Slot-2 / RAM expansion' },
        'ARM7 WRAM': { start: '0x03800000', end: '0x0380FFFF', size: '64 KB', desc: 'ARM7 exclusive RAM' }
      },
      registers: ['R0-R12 (ARM9)', 'SP/LR/PC (ARM9)', 'CPSR/SPSR (ARM9)', 'R0-R12 (ARM7)', 'SP/LR/PC (ARM7)', 'CPSR/SPSR (ARM7)', 'IPC Registers', '3D Matrix Stack'],
      audioSpec: { channels: '16 PCM/PSG channels', formats: 'PCM8, PCM16, IMA-ADPCM', psg: '6 PSG channels (ch8-13: square, ch14-15: noise)', mixer: 'Hardware mixer with volume/pan per channel', capture: 'Sound capture (2 channels)' },
      buildTools: { compiler: 'devkitARM gcc', path: '$DEVKITARM/bin/arm-none-eabi-gcc', flags: '-march=armv5te -mtune=arm946e-s -O2', sdk: 'devkitPro (libnds)', sdkUrl: 'https://devkitpro.org/' },
      romSizes: ['8 MB', '16 MB', '32 MB', '64 MB', '128 MB', '256 MB', '512 MB'],
      cartTypes: ['ROM Only', 'ROM + EEPROM 4KB', 'ROM + EEPROM 64KB', 'ROM + Flash 256KB', 'ROM + Flash 512KB', 'ROM + NAND'],
      sramSizes: ['None', '4 KB EEPROM', '64 KB EEPROM', '256 KB Flash', '512 KB Flash', '8 MB NAND']
    },
    n64: {
      id: 'n64', name: 'Nintendo 64', bits: 64, cpu: 'MIPS VR4300 (NEC VR4300)',
      clockSpeed: '93.75 MHz', resolution: '320x240 (up to 640x480)', resW: 320, resH: 240,
      colors: '16.7M colors (24-bit + alpha)', maxColors: 16777216, colorFormat: 'RGBA8888 / RGBA5551',
      vram: '(Unified 4 MB RDRAM)', vramBytes: 4194304, vramBanks: 0,
      wram: '4 MB RDRAM (8 MB w/ Expansion Pak)', wramBytes: 4194304, wramBanks: 0,
      soundChannels: 0, soundDesc: 'RSP-based audio (software mixer via microcode, typically 16-32 voices)',
      maxRom: '64 MB', maxRomBytes: 67108864,
      tileFormat: 'RGBA16/RGBA32/CI4/CI8/IA', tileSize: 0, bpp: 16, maxSprites: 0, spriteSizes: [],
      features: ['3D Hardware (RDP)', 'Reality Signal Processor (RSP)', 'Z-Buffer', 'Texture Mapping (TMEM 4KB)', 'Anti-Aliasing', 'Mip-Mapping', 'Tri-linear Filtering', 'Perspective Correction', '4 Controller Ports', 'Analog Stick', 'Rumble Pak', 'Expansion Pak (8MB)', 'Controller Pak (save)', 'Microcode (custom RSP programs)', 'Framebuffer Rendering'],
      graphicsModes: ['Framebuffer (no tile engine)', '16-bit color (RGBA5551)', '32-bit color (RGBA8888)', '3D polygon rendering (RDP)', 'Software 2D (sprites via RDP rects)'],
      fileExtension: '.z64',
      memoryMap: {
        'RDRAM': { start: '0x00000000', end: '0x003FFFFF', size: '4 MB', desc: 'Main RAM (8 MB w/ Expansion)' },
        'RDRAM Registers': { start: '0x03F00000', end: '0x03FFFFFF', size: '~', desc: 'RDRAM configuration' },
        'RSP DMEM': { start: '0x04000000', end: '0x04000FFF', size: '4 KB', desc: 'RSP data memory' },
        'RSP IMEM': { start: '0x04001000', end: '0x04001FFF', size: '4 KB', desc: 'RSP instruction memory (microcode)' },
        'RDP Registers': { start: '0x04100000', end: '0x041FFFFF', size: '~', desc: 'Reality Display Processor' },
        'MI Registers': { start: '0x04300000', end: '0x043FFFFF', size: '~', desc: 'MIPS Interface (interrupts)' },
        'VI Registers': { start: '0x04400000', end: '0x044FFFFF', size: '~', desc: 'Video Interface (framebuffer config)' },
        'AI Registers': { start: '0x04500000', end: '0x045FFFFF', size: '~', desc: 'Audio Interface (DMA to DAC)' },
        'PI Registers': { start: '0x04600000', end: '0x046FFFFF', size: '~', desc: 'Peripheral Interface (ROM access)' },
        'SI Registers': { start: '0x04800000', end: '0x048FFFFF', size: '~', desc: 'Serial Interface (controllers)' },
        'Cart ROM': { start: '0x10000000', end: '0x13FFFFFF', size: '64 MB', desc: 'Game cartridge ROM' },
        'PIF RAM': { start: '0x1FC007C0', end: '0x1FC007FF', size: '64 B', desc: 'PIF (controller/boot)' }
      },
      registers: ['$zero', '$at', '$v0-$v1', '$a0-$a3', '$t0-$t9', '$s0-$s7', '$k0-$k1', '$gp', '$sp', '$fp', '$ra', 'PC', 'HI', 'LO', 'Status', 'Cause', 'EPC', 'RSP VU Regs ($v00-$v31)'],
      audioSpec: { processor: 'RSP (Reality Signal Processor)', desc: 'Software audio via RSP microcode', formats: 'ADPCM (typically), Raw PCM', voices: '16-32 (depends on microcode budget)', output: '44.1 kHz stereo DAC via AI' },
      buildTools: { compiler: 'mips64-elf-gcc (libdragon)', path: '$N64_INST/bin/mips64-elf-gcc', flags: '-march=vr4300 -mtune=vr4300 -O2', sdk: 'libdragon', sdkUrl: 'https://github.com/DragonMinded/libdragon' },
      romSizes: ['4 MB', '8 MB', '12 MB', '16 MB', '24 MB', '32 MB', '64 MB'],
      cartTypes: ['ROM Only', 'ROM + Controller Pak', 'ROM + EEPROM 512B', 'ROM + EEPROM 2KB', 'ROM + SRAM 32KB', 'ROM + Flash 128KB'],
      sramSizes: ['None', '512 B EEPROM', '2 KB EEPROM', '32 KB SRAM', '128 KB Flash', 'Controller Pak (32 KB)']
    },
    windows: {
      id: 'windows', name: 'Windows (PC)', bits: 64, cpu: 'x86-64 (AMD64)',
      clockSpeed: '3.0+ GHz (variable)', resolution: '1920x1080 (up to 4K+)', resW: 1920, resH: 1080,
      colors: '16.7M+ (True Color)', maxColors: 16777216, colorFormat: 'RGBA8888',
      vram: 'GPU-dependent (2-24 GB)', vramBytes: 8589934592, vramBanks: 0,
      wram: '8-64 GB RAM', wramBytes: 17179869184, wramBanks: 0,
      soundChannels: 256, soundDesc: 'Software mixer (DirectSound/WASAPI/XAudio2)',
      maxRom: 'Unlimited (disk)', maxRomBytes: 0,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['DirectX 12', 'Vulkan', 'OpenGL 4.6', 'Multi-core CPU', 'GPU Compute', 'Ray Tracing', 'HDR', 'Variable Refresh Rate', 'Steam/Epic Integration', 'Keyboard/Mouse/Gamepad', 'Modding Support', 'Windowed/Fullscreen', 'Multi-monitor'],
      graphicsModes: ['DirectX 12 (feature level 12_2)', 'Vulkan 1.3', 'OpenGL 4.6', 'Software Renderer', 'Ray Tracing (DXR/Vulkan RT)'],
      fileExtension: '.exe',
      memoryMap: {
        'Virtual Memory': { start: '0x00000000', end: '0x7FFFFFFFFFFF', size: '128 TB', desc: 'User-mode virtual address space' },
        'Kernel Space': { start: '0xFFFF800000000000', end: '0xFFFFFFFFFFFFFFFF', size: '128 TB', desc: 'Kernel-mode (inaccessible)' }
      },
      registers: ['RAX', 'RBX', 'RCX', 'RDX', 'RSI', 'RDI', 'RBP', 'RSP', 'R8-R15', 'RIP', 'RFLAGS', 'XMM0-XMM15', 'YMM0-YMM15'],
      audioSpec: { api: 'WASAPI / XAudio2 / DirectSound', formats: 'PCM, ADPCM, Vorbis, Opus, MP3, FLAC', channels: '2-7.1 surround', sampleRate: '44100-192000 Hz' },
      buildTools: { compiler: 'MSVC / MinGW-w64 / Clang', path: 'cl.exe / g++ / clang++', flags: '/O2 /std:c++20', sdk: 'Windows SDK / DirectX SDK', sdkUrl: 'https://developer.microsoft.com/windows/' },
      romSizes: ['Unlimited'],
      cartTypes: ['Digital Distribution'],
      sramSizes: ['Unlimited (disk save)']
    },
    macos: {
      id: 'macos', name: 'macOS', bits: 64, cpu: 'ARM64 (Apple Silicon) / x86-64',
      clockSpeed: '3.0+ GHz (variable)', resolution: '2560x1600 (Retina)', resW: 2560, resH: 1600,
      colors: '16.7M+ (True Color)', maxColors: 16777216, colorFormat: 'RGBA8888',
      vram: 'Unified Memory (8-192 GB)', vramBytes: 8589934592, vramBanks: 0,
      wram: '8-192 GB Unified', wramBytes: 17179869184, wramBanks: 0,
      soundChannels: 256, soundDesc: 'Core Audio (software mixer)',
      maxRom: 'Unlimited (disk)', maxRomBytes: 0,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['Metal API', 'Metal Ray Tracing', 'Unified Memory Architecture', 'Apple Silicon (ARM64)', 'Core Audio', 'Game Controller framework', 'Retina Display', 'HDR', 'ProMotion (120Hz)', 'App Store / Steam'],
      graphicsModes: ['Metal 3', 'OpenGL 4.1 (deprecated)', 'Metal Ray Tracing', 'MetalFX Upscaling'],
      fileExtension: '.app',
      memoryMap: {
        'Virtual Memory': { start: '0x00000000', end: '0x7FFFFFFFFFFF', size: '128 TB', desc: 'User-mode virtual address space' }
      },
      registers: ['X0-X28 (ARM64)', 'FP (X29)', 'LR (X30)', 'SP', 'PC', 'NZCV', 'V0-V31 (SIMD)'],
      audioSpec: { api: 'Core Audio / AVAudioEngine', formats: 'PCM, AAC, ALAC, Vorbis, Opus', channels: '2-7.1 surround', sampleRate: '44100-192000 Hz' },
      buildTools: { compiler: 'Apple Clang (Xcode)', path: '/usr/bin/clang++', flags: '-O2 -std=c++20 -framework Metal', sdk: 'Xcode / Metal SDK', sdkUrl: 'https://developer.apple.com/xcode/' },
      romSizes: ['Unlimited'],
      cartTypes: ['Digital Distribution'],
      sramSizes: ['Unlimited (disk save)']
    },
    linux: {
      id: 'linux', name: 'Linux', bits: 64, cpu: 'x86-64 / ARM64',
      clockSpeed: '3.0+ GHz (variable)', resolution: '1920x1080 (up to 4K+)', resW: 1920, resH: 1080,
      colors: '16.7M+ (True Color)', maxColors: 16777216, colorFormat: 'RGBA8888',
      vram: 'GPU-dependent (2-24 GB)', vramBytes: 8589934592, vramBanks: 0,
      wram: '8-64 GB RAM', wramBytes: 17179869184, wramBanks: 0,
      soundChannels: 256, soundDesc: 'PulseAudio/PipeWire/ALSA',
      maxRom: 'Unlimited (disk)', maxRomBytes: 0,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['Vulkan', 'OpenGL 4.6', 'Multi-core CPU', 'GPU Compute', 'Ray Tracing', 'Wayland/X11', 'Steam Deck (SteamOS)', 'Proton Compatibility', 'Open Source Drivers'],
      graphicsModes: ['Vulkan 1.3', 'OpenGL 4.6', 'Vulkan Ray Tracing', 'Software Renderer'],
      fileExtension: '',
      memoryMap: {
        'Virtual Memory': { start: '0x00000000', end: '0x7FFFFFFFFFFF', size: '128 TB', desc: 'User-mode virtual address space' }
      },
      registers: ['RAX', 'RBX', 'RCX', 'RDX', 'RSI', 'RDI', 'RBP', 'RSP', 'R8-R15', 'RIP', 'RFLAGS', 'XMM0-XMM15'],
      audioSpec: { api: 'PipeWire / PulseAudio / ALSA', formats: 'PCM, Vorbis, Opus, FLAC, MP3', channels: '2-7.1 surround', sampleRate: '44100-192000 Hz' },
      buildTools: { compiler: 'GCC / Clang', path: '/usr/bin/g++', flags: '-O2 -std=c++20', sdk: 'SDL2 / Vulkan SDK', sdkUrl: 'https://www.lunarg.com/vulkan-sdk/' },
      romSizes: ['Unlimited'],
      cartTypes: ['Digital Distribution'],
      sramSizes: ['Unlimited (disk save)']
    },
    ios: {
      id: 'ios', name: 'iOS (iPhone/iPad)', bits: 64, cpu: 'ARM64 (Apple A-series/M-series)',
      clockSpeed: '2.0-3.5 GHz', resolution: '2532x1170 (iPhone) / 2732x2048 (iPad)', resW: 2532, resH: 1170,
      colors: '16.7M+ (True Color)', maxColors: 16777216, colorFormat: 'RGBA8888',
      vram: 'Unified Memory (4-16 GB)', vramBytes: 4294967296, vramBanks: 0,
      wram: '4-16 GB Unified', wramBytes: 4294967296, wramBanks: 0,
      soundChannels: 128, soundDesc: 'Core Audio (hardware-accelerated)',
      maxRom: 'Unlimited (App Store)', maxRomBytes: 0,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['Metal 3', 'Metal Ray Tracing', 'Touch Input (multi-touch)', 'Accelerometer', 'Gyroscope', 'Haptic Feedback (Taptic)', 'Game Controller Support', 'ProMotion (120Hz)', 'HDR Display', 'ARKit', 'Game Center', 'In-App Purchase'],
      graphicsModes: ['Metal 3', 'MetalFX Upscaling', 'Metal Ray Tracing'],
      fileExtension: '.ipa',
      memoryMap: {
        'Virtual Memory': { start: '0x00000000', end: '0xFFFFFFFFFF', size: '1 TB', desc: 'App virtual address space (sandboxed)' }
      },
      registers: ['X0-X28', 'FP (X29)', 'LR (X30)', 'SP', 'PC', 'NZCV', 'V0-V31 (SIMD)'],
      audioSpec: { api: 'AVAudioEngine / Core Audio', formats: 'PCM, AAC, ALAC, Opus', channels: 'Stereo / Spatial Audio', sampleRate: '44100-48000 Hz' },
      buildTools: { compiler: 'Apple Clang (Xcode)', path: 'xcrun clang++', flags: '-O2 -std=c++20 -framework Metal -framework UIKit', sdk: 'Xcode / iOS SDK', sdkUrl: 'https://developer.apple.com/ios/' },
      romSizes: ['Unlimited'],
      cartTypes: ['App Store'],
      sramSizes: ['Unlimited (sandboxed storage)']
    },
    android: {
      id: 'android', name: 'Android', bits: 64, cpu: 'ARM64 (Snapdragon/Exynos/Tensor)',
      clockSpeed: '2.0-3.3 GHz', resolution: '2400x1080 (common)', resW: 2400, resH: 1080,
      colors: '16.7M+ (True Color)', maxColors: 16777216, colorFormat: 'RGBA8888',
      vram: 'Shared GPU Memory (2-12 GB)', vramBytes: 4294967296, vramBanks: 0,
      wram: '4-16 GB RAM', wramBytes: 4294967296, wramBanks: 0,
      soundChannels: 128, soundDesc: 'AAudio/OpenSL ES',
      maxRom: 'Unlimited (Play Store)', maxRomBytes: 0,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['Vulkan', 'OpenGL ES 3.2', 'Touch Input (multi-touch)', 'Accelerometer', 'Gyroscope', 'Haptic Feedback', 'Game Controller Support', 'High Refresh Rate (90-144Hz)', 'Google Play Services', 'In-App Purchase', 'NDK (native C/C++)'],
      graphicsModes: ['Vulkan 1.1+', 'OpenGL ES 3.2', 'Vulkan Ray Tracing (select GPUs)'],
      fileExtension: '.apk',
      memoryMap: {
        'Virtual Memory': { start: '0x00000000', end: '0xFFFFFFFFFF', size: '~', desc: 'App virtual address space (sandboxed)' }
      },
      registers: ['X0-X28', 'FP (X29)', 'LR (X30)', 'SP', 'PC', 'NZCV', 'V0-V31 (SIMD)'],
      audioSpec: { api: 'AAudio / Oboe / OpenSL ES', formats: 'PCM, Vorbis, Opus, AAC, MP3', channels: 'Stereo / Spatial Audio', sampleRate: '44100-48000 Hz' },
      buildTools: { compiler: 'Android NDK (Clang)', path: '$ANDROID_NDK/toolchains/llvm/prebuilt/*/bin/clang++', flags: '-O2 -std=c++20 -target aarch64-linux-android33', sdk: 'Android NDK / SDK', sdkUrl: 'https://developer.android.com/ndk' },
      romSizes: ['Unlimited'],
      cartTypes: ['Google Play / APK'],
      sramSizes: ['Unlimited (sandboxed storage)']
    },
    switch: {
      id: 'switch', name: 'Nintendo Switch', bits: 64, cpu: 'ARM Cortex-A57 (Nvidia Tegra X1)',
      clockSpeed: '1.02 GHz (docked) / 768 MHz (handheld)', resolution: '1920x1080 (docked) / 1280x720 (handheld)', resW: 1920, resH: 1080,
      colors: '16.7M+ (True Color)', maxColors: 16777216, colorFormat: 'RGBA8888',
      vram: 'Shared 4 GB LPDDR4', vramBytes: 4294967296, vramBanks: 0,
      wram: '4 GB LPDDR4 (shared)', wramBytes: 4294967296, wramBanks: 0,
      soundChannels: 128, soundDesc: 'Software mixer (ADPCM, PCM)',
      maxRom: '32 GB (Game Card)', maxRomBytes: 34359738368,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['Nvidia Maxwell GPU', 'OpenGL 4.5 / Vulkan', 'Portable/Docked Modes', 'Joy-Con (detachable)', 'HD Rumble', 'Motion Controls (gyro/accel)', 'Touchscreen (handheld)', 'NFC (amiibo)', 'Local Wireless', 'Online Play', 'Pro Controller'],
      graphicsModes: ['OpenGL 4.5', 'Vulkan 1.1', 'NVN (proprietary)', 'Docked (1080p) / Handheld (720p)'],
      fileExtension: '.nsp',
      memoryMap: {
        'Main Memory': { start: '0x00000000', end: '0xFFFFFFFF', size: '4 GB', desc: 'Shared LPDDR4 (CPU+GPU)' }
      },
      registers: ['X0-X28', 'FP (X29)', 'LR (X30)', 'SP', 'PC', 'NZCV', 'V0-V31 (SIMD)'],
      audioSpec: { api: 'nn::audio (proprietary)', formats: 'ADPCM, PCM16, Opus', channels: 'Stereo / 5.1 surround', sampleRate: '48000 Hz' },
      buildTools: { compiler: 'Nintendo SDK (Clang)', path: 'Nintendo SDK toolchain', flags: '-O2 -std=c++17', sdk: 'Nintendo Switch SDK', sdkUrl: 'https://developer.nintendo.com/' },
      romSizes: ['1 GB', '2 GB', '4 GB', '8 GB', '16 GB', '32 GB'],
      cartTypes: ['Game Card', 'Digital (eShop)'],
      sramSizes: ['Save Data (system managed)']
    },
    switch2: {
      id: 'switch2', name: 'Nintendo Switch 2', bits: 64, cpu: 'ARM Cortex-A78 (Nvidia Tegra T239)',
      clockSpeed: '1.5+ GHz (estimated)', resolution: '3840x2160 (docked, upscaled) / 1920x1080 (handheld)', resW: 3840, resH: 2160,
      colors: '16.7M+ (True Color + HDR)', maxColors: 16777216, colorFormat: 'RGBA8888 / HDR10',
      vram: 'Shared 12 GB LPDDR5', vramBytes: 12884901888, vramBanks: 0,
      wram: '12 GB LPDDR5 (shared)', wramBytes: 12884901888, wramBanks: 0,
      soundChannels: 256, soundDesc: 'Software mixer (advanced)',
      maxRom: '64 GB (Game Card)', maxRomBytes: 68719476736,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['Nvidia Ampere GPU', 'DLSS / AI Upscaling', 'Ray Tracing', 'HDR', 'Portable/Docked Modes', 'Joy-Con 2 (magnetic)', 'HD Rumble', 'Motion Controls', 'Touchscreen', 'NFC', 'Backward Compatibility (Switch)', 'Online Play', 'Camera'],
      graphicsModes: ['Vulkan 1.3', 'NVN 2 (proprietary)', 'Ray Tracing', 'DLSS Upscaling', 'Docked (4K) / Handheld (1080p)'],
      fileExtension: '.nsp',
      memoryMap: {
        'Main Memory': { start: '0x00000000', end: '0x2FFFFFFFF', size: '12 GB', desc: 'Shared LPDDR5 (CPU+GPU)' }
      },
      registers: ['X0-X28', 'FP (X29)', 'LR (X30)', 'SP', 'PC', 'NZCV', 'V0-V31 (SIMD)'],
      audioSpec: { api: 'nn::audio (proprietary)', formats: 'ADPCM, PCM16, Opus, Spatial Audio', channels: 'Stereo / 7.1 surround / Spatial', sampleRate: '48000 Hz' },
      buildTools: { compiler: 'Nintendo SDK (Clang)', path: 'Nintendo SDK toolchain', flags: '-O2 -std=c++20', sdk: 'Nintendo Switch 2 SDK', sdkUrl: 'https://developer.nintendo.com/' },
      romSizes: ['4 GB', '8 GB', '16 GB', '32 GB', '64 GB'],
      cartTypes: ['Game Card', 'Digital (eShop)'],
      sramSizes: ['Save Data (system managed)']
    },
    ps1: {
      id: 'ps1', name: 'PlayStation 1', bits: 32, cpu: 'MIPS R3000A',
      clockSpeed: '33.87 MHz', resolution: '256x224 to 640x480', resW: 320, resH: 240,
      colors: '16.7M (24-bit)', maxColors: 16777216, colorFormat: 'RGB888 / RGB555',
      vram: '1 MB', vramBytes: 1048576, vramBanks: 1,
      wram: '2 MB RAM + 1 MB VRAM', wramBytes: 2097152, wramBanks: 1,
      soundChannels: 24, soundDesc: 'SPU (24 ADPCM channels)',
      maxRom: '650 MB (CD-ROM)', maxRomBytes: 681574400,
      tileFormat: '4BPP / 8BPP / 16BPP', tileSize: 0, bpp: 16, maxSprites: 4000, spriteSizes: [],
      features: ['3D Polygon Rendering (GTE)', 'Geometry Transform Engine', 'Affine Texture Mapping', 'Gouraud Shading', 'CD-ROM (2x)', 'FMV Playback (MDEC)', 'Memory Card (save)', 'Dual Analog Controller', 'Vibration Feedback'],
      graphicsModes: ['256x224', '320x240', '512x240', '640x240', '256x480 (interlaced)', '512x480 (interlaced)', '640x480 (interlaced)'],
      fileExtension: '.bin/.cue',
      memoryMap: {
        'Main RAM': { start: '0x00000000', end: '0x001FFFFF', size: '2 MB', desc: 'Main memory' },
        'Scratchpad': { start: '0x1F800000', end: '0x1F8003FF', size: '1 KB', desc: 'Fast data cache' },
        'I/O Ports': { start: '0x1F801000', end: '0x1F802FFF', size: '8 KB', desc: 'Hardware registers' },
        'BIOS ROM': { start: '0x1FC00000', end: '0x1FC7FFFF', size: '512 KB', desc: 'System BIOS' }
      },
      registers: ['$zero', '$at', '$v0-$v1', '$a0-$a3', '$t0-$t9', '$s0-$s7', '$k0-$k1', '$gp', '$sp', '$fp', '$ra', 'PC', 'HI', 'LO', 'GTE Registers'],
      audioSpec: { channels: '24 ADPCM voices', format: 'ADPCM (4-bit compressed)', sampleRate: '44100 Hz', reverb: 'Hardware reverb SPU', cdAudio: 'CD-DA playback' },
      buildTools: { compiler: 'mipsel-none-elf-gcc (PSn00bSDK)', path: 'mipsel-none-elf-gcc', flags: '-march=r3000 -O2', sdk: 'PSn00bSDK / PsyQ', sdkUrl: 'https://github.com/Lameguy64/PSn00bSDK' },
      romSizes: ['650 MB (CD-ROM)'],
      cartTypes: ['CD-ROM'],
      sramSizes: ['128 KB Memory Card']
    },
    ps2: {
      id: 'ps2', name: 'PlayStation 2', bits: 128, cpu: 'MIPS R5900 (Emotion Engine)',
      clockSpeed: '294.912 MHz', resolution: '640x448 (NTSC) / 640x512 (PAL)', resW: 640, resH: 448,
      colors: '16.7M (24-bit)', maxColors: 16777216, colorFormat: 'RGBA8888',
      vram: '4 MB eDRAM (GS)', vramBytes: 4194304, vramBanks: 1,
      wram: '32 MB RDRAM + 4 MB VRAM', wramBytes: 33554432, wramBanks: 1,
      soundChannels: 48, soundDesc: 'SPU2 (48 ADPCM channels, 2 cores)',
      maxRom: '8.5 GB (DVD)', maxRomBytes: 9126805504,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['128-bit Emotion Engine', 'Vector Units (VU0/VU1)', 'Graphics Synthesizer (GS)', 'DMA Controller (10 channels)', 'DVD-ROM', 'USB 1.1', 'Network Adapter', 'Memory Card (8MB)', 'DualShock 2 (pressure-sensitive)', 'Multi-tap (4 players)', 'PS1 Backward Compatibility', 'HDD Support'],
      graphicsModes: ['640x448 (NTSC)', '640x512 (PAL)', '720x480 (progressive)', '1280x720 (select games)', 'Interlaced / Progressive'],
      fileExtension: '.iso',
      memoryMap: {
        'Main RAM': { start: '0x00000000', end: '0x01FFFFFF', size: '32 MB', desc: 'RDRAM (EE)' },
        'Scratchpad': { start: '0x70000000', end: '0x70003FFF', size: '16 KB', desc: 'Fast scratchpad (EE)' },
        'GS VRAM': { start: '0x00000000', end: '0x003FFFFF', size: '4 MB', desc: 'Graphics Synthesizer eDRAM (separate bus)' },
        'IOP RAM': { start: '0x00000000', end: '0x001FFFFF', size: '2 MB', desc: 'I/O Processor memory' }
      },
      registers: ['$zero', '$at', '$v0-$v1', '$a0-$a3', '$t0-$t9', '$s0-$s7', '$k0-$k1', '$gp', '$sp', '$fp', '$ra', 'PC', 'HI/LO', 'HI1/LO1', 'SA', 'VU0 Registers', 'VU1 Registers', 'GS Privileged Regs'],
      audioSpec: { channels: '48 ADPCM voices (2 SPU2 cores)', format: 'ADPCM (4-bit)', sampleRate: '44100 / 48000 Hz', effects: 'Hardware reverb, delay, chorus per core', streaming: 'IOP-based streaming' },
      buildTools: { compiler: 'ee-gcc (ps2sdk)', path: '$PS2SDK/ee/bin/mips64r5900el-ps2-elf-gcc', flags: '-O2 -G0', sdk: 'ps2sdk', sdkUrl: 'https://github.com/ps2dev/ps2sdk' },
      romSizes: ['4.7 GB (DVD-5)', '8.5 GB (DVD-9)'],
      cartTypes: ['DVD-ROM', 'CD-ROM'],
      sramSizes: ['8 MB Memory Card']
    },
    ps3: {
      id: 'ps3', name: 'PlayStation 3', bits: 64, cpu: 'Cell Broadband Engine (PPE + 7 SPEs)',
      clockSpeed: '3.2 GHz', resolution: '1920x1080 (Full HD)', resW: 1920, resH: 1080,
      colors: '16.7M+ (True Color)', maxColors: 16777216, colorFormat: 'RGBA8888',
      vram: '256 MB GDDR3 (RSX)', vramBytes: 268435456, vramBanks: 1,
      wram: '256 MB XDR RAM', wramBytes: 268435456, wramBanks: 1,
      soundChannels: 512, soundDesc: 'Software mixer (7.1 LPCM, Dolby/DTS)',
      maxRom: '50 GB (Blu-ray)', maxRomBytes: 53687091200,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['Cell Broadband Engine (8 SPEs)', 'RSX GPU (Nvidia)', 'Blu-ray Drive', 'HDD (built-in)', 'USB 2.0', 'Bluetooth', 'Gigabit Ethernet', 'Wi-Fi', 'HDMI 1.3', 'SIXAXIS/DualShock 3', 'PlayStation Network', 'Trophy System', 'PS1/PS2 BC (early models)'],
      graphicsModes: ['480p', '720p', '1080i', '1080p', 'Stereoscopic 3D'],
      fileExtension: '.pkg',
      memoryMap: {
        'Main RAM': { start: '0x00000000', end: '0x0FFFFFFF', size: '256 MB', desc: 'XDR RAM (Cell)' },
        'Video RAM': { start: '0x00000000', end: '0x0FFFFFFF', size: '256 MB', desc: 'GDDR3 (RSX, separate bus)' }
      },
      registers: ['GPR0-GPR31 (PPE)', 'FPR0-FPR31 (PPE)', 'SPE Registers (128x128-bit per SPE)', 'CR', 'LR', 'CTR', 'XER'],
      audioSpec: { api: 'MultiStream / libatrac3plus', formats: 'LPCM, Dolby Digital, DTS, AAC, AT3', channels: '7.1 LPCM surround', sampleRate: '48000 Hz' },
      buildTools: { compiler: 'ppu-gcc / spu-gcc (PSL1GHT)', path: 'ppu-lv2-gcc / spu-gcc', flags: '-O2 -maltivec', sdk: 'PSL1GHT / PS3 SDK', sdkUrl: 'https://github.com/ps3dev/PSL1GHT' },
      romSizes: ['25 GB (BD-25)', '50 GB (BD-50)'],
      cartTypes: ['Blu-ray Disc', 'Digital (PSN)'],
      sramSizes: ['HDD Save (system managed)']
    },
    ps4: {
      id: 'ps4', name: 'PlayStation 4', bits: 64, cpu: 'AMD Jaguar x86-64 (8 cores)',
      clockSpeed: '1.6 GHz (base) / 2.13 GHz (Pro)', resolution: '1920x1080 (4K on Pro)', resW: 1920, resH: 1080,
      colors: '16.7M+ (True Color)', maxColors: 16777216, colorFormat: 'RGBA8888',
      vram: '8 GB GDDR5 (unified)', vramBytes: 8589934592, vramBanks: 0,
      wram: '8 GB GDDR5 (unified, shared with GPU)', wramBytes: 8589934592, wramBanks: 0,
      soundChannels: 512, soundDesc: 'Software mixer (7.1, 3D Audio on headset)',
      maxRom: '100 GB (Blu-ray)', maxRomBytes: 107374182400,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['AMD GCN GPU', 'Unified GDDR5 Memory', 'Blu-ray Drive', 'HDD (built-in, swappable)', 'USB 3.0', 'Bluetooth 2.1', 'Gigabit Ethernet', 'Wi-Fi', 'HDMI 1.4 (2.0 on Pro)', 'DualShock 4 (touchpad, light bar, speaker)', 'PlayStation Camera', 'PS VR', 'Share Button', 'Remote Play', 'Rest Mode', 'PlayStation Network'],
      graphicsModes: ['1080p', '4K (Pro, checkerboard)', 'HDR10', 'PS VR (stereoscopic)'],
      fileExtension: '.pkg',
      memoryMap: {
        'Unified Memory': { start: '0x00000000', end: '0x1FFFFFFFF', size: '8 GB', desc: 'GDDR5 (CPU+GPU shared)' }
      },
      registers: ['RAX', 'RBX', 'RCX', 'RDX', 'RSI', 'RDI', 'RBP', 'RSP', 'R8-R15', 'RIP', 'RFLAGS', 'XMM0-XMM15'],
      audioSpec: { api: 'libSceAudioOut / Wwise / FMOD', formats: 'PCM, AAC, AT9, Opus', channels: '7.1 surround / 3D Audio (headset)', sampleRate: '48000 Hz' },
      buildTools: { compiler: 'Clang (Orbis SDK)', path: 'orbis-clang++', flags: '-O2 -std=c++17', sdk: 'PlayStation 4 SDK (Orbis)', sdkUrl: 'https://partners.playstation.net/' },
      romSizes: ['25 GB', '50 GB', '100 GB'],
      cartTypes: ['Blu-ray Disc', 'Digital (PSN)'],
      sramSizes: ['HDD/SSD Save (system managed)']
    },
    ps5: {
      id: 'ps5', name: 'PlayStation 5', bits: 64, cpu: 'AMD Zen 2 x86-64 (8 cores / 16 threads)',
      clockSpeed: '3.5 GHz (variable)', resolution: '3840x2160 (4K) / 7680x4320 (8K support)', resW: 3840, resH: 2160,
      colors: '16.7M+ (HDR, 10-bit)', maxColors: 16777216, colorFormat: 'RGBA8888 / HDR10',
      vram: '16 GB GDDR6 (unified)', vramBytes: 17179869184, vramBanks: 0,
      wram: '16 GB GDDR6 (unified, shared with GPU)', wramBytes: 17179869184, wramBanks: 0,
      soundChannels: 1024, soundDesc: 'Tempest 3D AudioTech',
      maxRom: '100 GB (UHD Blu-ray)', maxRomBytes: 107374182400,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['AMD RDNA 2 GPU', 'Ray Tracing (hardware)', 'Custom SSD (5.5 GB/s)', 'Tempest 3D Audio', 'UHD Blu-ray', 'NVMe SSD (expandable)', 'USB-C', 'Wi-Fi 6', 'Bluetooth 5.1', 'HDMI 2.1', 'DualSense (haptic feedback, adaptive triggers, speaker, mic)', 'PS VR2', 'Activity Cards', 'Game Help', 'PS4 Backward Compatibility'],
      graphicsModes: ['1080p', '1440p', '4K', '8K (future)', 'Ray Tracing', 'HDR10', '120Hz', 'VRR', 'PS VR2 (stereoscopic)'],
      fileExtension: '.pkg',
      memoryMap: {
        'Unified Memory': { start: '0x00000000', end: '0x3FFFFFFFF', size: '16 GB', desc: 'GDDR6 (CPU+GPU shared)' }
      },
      registers: ['RAX', 'RBX', 'RCX', 'RDX', 'RSI', 'RDI', 'RBP', 'RSP', 'R8-R15', 'RIP', 'RFLAGS', 'XMM0-XMM15', 'YMM0-YMM15', 'ZMM0-ZMM31'],
      audioSpec: { api: 'Tempest 3D AudioTech', formats: 'PCM, AAC, AT9, Opus', channels: 'Hundreds of 3D audio sources', sampleRate: '48000 Hz', spatial: 'Object-based 3D audio (HRTF)' },
      buildTools: { compiler: 'Clang (Prospero SDK)', path: 'prospero-clang++', flags: '-O2 -std=c++20', sdk: 'PlayStation 5 SDK (Prospero)', sdkUrl: 'https://partners.playstation.net/' },
      romSizes: ['25 GB', '50 GB', '100 GB'],
      cartTypes: ['UHD Blu-ray Disc', 'Digital (PSN)'],
      sramSizes: ['SSD Save (system managed)']
    },
    xbox: {
      id: 'xbox', name: 'Xbox', bits: 32, cpu: 'Intel Pentium III (Custom)',
      clockSpeed: '733 MHz', resolution: '640x480 (up to 1080i)', resW: 640, resH: 480,
      colors: '16.7M (24-bit)', maxColors: 16777216, colorFormat: 'RGBA8888',
      vram: '64 MB DDR (unified)', vramBytes: 67108864, vramBanks: 0,
      wram: '64 MB DDR (unified)', wramBytes: 67108864, wramBanks: 0,
      soundChannels: 256, soundDesc: 'Nvidia MCPX (64 3D voices + software)',
      maxRom: '8.5 GB (DVD)', maxRomBytes: 9126805504,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['Nvidia NV2A GPU', 'Custom Intel CPU', 'HDD (8-10 GB built-in)', 'DVD Drive', 'Ethernet (built-in)', '4 Controller Ports', 'Xbox Live', 'Dolby Digital 5.1', 'Component Video (HD)'],
      graphicsModes: ['480i', '480p', '720p', '1080i'],
      fileExtension: '.xbe',
      memoryMap: {
        'Unified Memory': { start: '0x00000000', end: '0x03FFFFFF', size: '64 MB', desc: 'DDR RAM (CPU+GPU shared)' }
      },
      registers: ['EAX', 'EBX', 'ECX', 'EDX', 'ESI', 'EDI', 'EBP', 'ESP', 'EIP', 'EFLAGS', 'XMM0-XMM7'],
      audioSpec: { channels: '64 3D hardware voices', format: 'PCM, ADPCM', effects: 'Hardware DSP (reverb, chorus, etc.)', output: 'Dolby Digital 5.1' },
      buildTools: { compiler: 'MSVC / nxdk gcc', path: 'cl.exe / nxdk-gcc', flags: '/O2', sdk: 'Xbox SDK / nxdk', sdkUrl: 'https://github.com/XboxDev/nxdk' },
      romSizes: ['4.7 GB (DVD-5)', '8.5 GB (DVD-9)'],
      cartTypes: ['DVD-ROM'],
      sramSizes: ['HDD Save (8 GB built-in)']
    },
    xbox360: {
      id: 'xbox360', name: 'Xbox 360', bits: 64, cpu: 'IBM Xenon (PowerPC, 3 cores)',
      clockSpeed: '3.2 GHz', resolution: '1920x1080 (Full HD)', resW: 1920, resH: 1080,
      colors: '16.7M+ (True Color)', maxColors: 16777216, colorFormat: 'RGBA8888',
      vram: '512 MB GDDR3 (unified)', vramBytes: 536870912, vramBanks: 0,
      wram: '512 MB GDDR3 (unified)', wramBytes: 536870912, wramBanks: 0,
      soundChannels: 320, soundDesc: 'XMA hardware decoder + software mixer',
      maxRom: '8.5 GB (DVD) / 25 GB (BD select)', maxRomBytes: 9126805504,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['ATI Xenos GPU (unified shaders)', 'eDRAM (10 MB, free MSAA)', 'DVD Drive', 'HDD (optional/built-in)', 'USB 2.0', 'Wi-Fi (S/E models)', 'Ethernet', 'Xbox Live', 'Achievements', 'Kinect Support', 'Wireless Controllers'],
      graphicsModes: ['480p', '720p', '1080i', '1080p'],
      fileExtension: '.xex',
      memoryMap: {
        'Unified Memory': { start: '0x00000000', end: '0x1FFFFFFF', size: '512 MB', desc: 'GDDR3 (CPU+GPU shared)' }
      },
      registers: ['GPR0-GPR31 (PowerPC)', 'FPR0-FPR31', 'CR', 'LR', 'CTR', 'XER', 'VMX Registers (128x128-bit)'],
      audioSpec: { api: 'XAudio2', formats: 'XMA, PCM, xWMA', channels: '5.1 surround', sampleRate: '48000 Hz' },
      buildTools: { compiler: 'MSVC (Xbox 360 SDK)', path: 'Xbox 360 SDK toolchain', flags: '/O2', sdk: 'Xbox 360 SDK', sdkUrl: 'https://developer.microsoft.com/' },
      romSizes: ['4.7 GB (DVD-5)', '8.5 GB (DVD-9)'],
      cartTypes: ['DVD-ROM', 'Digital (XBLA)'],
      sramSizes: ['HDD Save / Memory Unit']
    },
    xboxone: {
      id: 'xboxone', name: 'Xbox One', bits: 64, cpu: 'AMD Jaguar x86-64 (8 cores)',
      clockSpeed: '1.75 GHz', resolution: '1920x1080 (4K on One X)', resW: 1920, resH: 1080,
      colors: '16.7M+ (True Color + HDR)', maxColors: 16777216, colorFormat: 'RGBA8888',
      vram: '8 GB DDR3 + 32 MB ESRAM (unified)', vramBytes: 8589934592, vramBanks: 0,
      wram: '8 GB DDR3 (unified)', wramBytes: 8589934592, wramBanks: 0,
      soundChannels: 512, soundDesc: 'Software mixer (7.1, Atmos)',
      maxRom: '50 GB (Blu-ray)', maxRomBytes: 53687091200,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['AMD GCN GPU', 'ESRAM (32 MB, One/S)', 'Blu-ray Drive', 'HDD (500 GB / 1 TB)', 'USB 3.0', 'Wi-Fi', 'Ethernet', 'HDMI In/Out', 'Kinect (optional)', 'Xbox Live', 'Achievements', 'Game DVR', 'Backward Compatibility (360/OG Xbox)', 'HDR10 (One S/X)'],
      graphicsModes: ['720p', '900p', '1080p', '4K (One X)', 'HDR10'],
      fileExtension: '.xvd',
      memoryMap: {
        'Unified Memory': { start: '0x00000000', end: '0x1FFFFFFFF', size: '8 GB', desc: 'DDR3 (CPU+GPU shared)' },
        'ESRAM': { start: '0x00000000', end: '0x01FFFFFF', size: '32 MB', desc: 'Embedded SRAM (fast, GPU tile rendering)' }
      },
      registers: ['RAX', 'RBX', 'RCX', 'RDX', 'RSI', 'RDI', 'RBP', 'RSP', 'R8-R15', 'RIP', 'RFLAGS', 'XMM0-XMM15'],
      audioSpec: { api: 'XAudio2 / Windows Sonic / Dolby Atmos', formats: 'PCM, XMA2, Opus', channels: '7.1 surround / Atmos (object-based)', sampleRate: '48000 Hz' },
      buildTools: { compiler: 'Clang (GDK)', path: 'Xbox GDK toolchain', flags: '/O2 /std:c++17', sdk: 'Microsoft GDK', sdkUrl: 'https://developer.microsoft.com/games/' },
      romSizes: ['25 GB', '50 GB'],
      cartTypes: ['Blu-ray Disc', 'Digital (Microsoft Store)'],
      sramSizes: ['HDD/SSD Save (system managed)']
    },
    xboxsx: {
      id: 'xboxsx', name: 'Xbox Series X|S', bits: 64, cpu: 'AMD Zen 2 x86-64 (8 cores / 16 threads)',
      clockSpeed: '3.8 GHz (3.6 GHz w/ SMT)', resolution: '3840x2160 (4K) / 7680x4320 (8K support)', resW: 3840, resH: 2160,
      colors: '16.7M+ (HDR, 10-bit)', maxColors: 16777216, colorFormat: 'RGBA8888 / HDR10',
      vram: '16 GB GDDR6 (10 GB @ 560 GB/s + 6 GB @ 336 GB/s)', vramBytes: 17179869184, vramBanks: 0,
      wram: '16 GB GDDR6 (unified)', wramBytes: 17179869184, wramBanks: 0,
      soundChannels: 1024, soundDesc: 'Hardware audio decompression + Spatial Sound',
      maxRom: '100 GB (UHD Blu-ray, Series X)', maxRomBytes: 107374182400,
      tileFormat: 'Any (software)', tileSize: 0, bpp: 32, maxSprites: 0, spriteSizes: [],
      features: ['AMD RDNA 2 GPU', 'Ray Tracing (hardware)', 'Custom NVMe SSD (2.4 GB/s)', 'Velocity Architecture', 'DirectX 12 Ultimate', 'Mesh Shaders', 'Variable Rate Shading', 'Sampler Feedback Streaming', 'UHD Blu-ray (Series X)', 'USB-C', 'Wi-Fi 5', 'Ethernet', 'HDMI 2.1', 'Xbox Wireless Controller', 'Smart Delivery', 'Quick Resume', 'Xbox Game Pass', 'Backward Compatibility (all Xbox gens)'],
      graphicsModes: ['1080p', '1440p', '4K', '8K (future)', 'Ray Tracing', 'HDR10 / Dolby Vision', '120Hz', 'VRR'],
      fileExtension: '.xvd',
      memoryMap: {
        'Unified Memory': { start: '0x00000000', end: '0x3FFFFFFFF', size: '16 GB', desc: 'GDDR6 (CPU+GPU shared)' }
      },
      registers: ['RAX', 'RBX', 'RCX', 'RDX', 'RSI', 'RDI', 'RBP', 'RSP', 'R8-R15', 'RIP', 'RFLAGS', 'XMM0-XMM15', 'YMM0-YMM15', 'ZMM0-ZMM31'],
      audioSpec: { api: 'XAudio2 / Windows Sonic / Dolby Atmos', formats: 'PCM, Opus, hardware decompression', channels: 'Spatial Sound / Dolby Atmos (object-based)', sampleRate: '48000 Hz', spatial: 'Hardware-accelerated spatial audio' },
      buildTools: { compiler: 'Clang (GDK)', path: 'Xbox GDK toolchain', flags: '/O2 /std:c++20', sdk: 'Microsoft GDK', sdkUrl: 'https://developer.microsoft.com/games/' },
      romSizes: ['25 GB', '50 GB', '100 GB'],
      cartTypes: ['UHD Blu-ray (Series X)', 'Digital (Microsoft Store)'],
      sramSizes: ['NVMe SSD Save (system managed)']
    }
  };

  var currentPlatform = 'gbc';

  function getEngineFeatures(platformId) {
    var p = platforms[platformId] || platforms.gbc;
    var bits = p.bits > 64 ? 64 : p.bits;
    var features = {
      rendering: [],
      physics: [],
      entity: [],
      audio: [],
      save: [],
      input: [],
      scene: []
    };

    if (bits <= 8) {
      features.rendering = ['Tile-based BG (8x8)', 'Sprite Renderer (OAM)', 'BG Scrolling', 'Window Overlay', 'Palette Swap', 'Screen Fade (palette)'];
      features.physics = ['Tile-based AABB Collision', 'Grid Movement (4-dir/8-dir)', 'Simple Gravity (platform)'];
      features.entity = ['Sprite Entity (8x8/8x16)', 'Metasprite (multi-tile)', 'Entity Pool (max ~20)', 'Component: Transform', 'Component: Sprite Renderer', 'Component: Collision Box', 'Component: Movement', 'Component: Stats', 'Component: AI (simple FSM)'];
      features.audio = ['4-Channel Sound Driver', 'Music Sequencer (tracker)', 'SFX Priority System', 'Wave RAM Patterns'];
      features.save = ['SRAM Save (battery-backed)', 'Checksum Validation', 'Multiple Save Slots'];
      features.input = ['D-Pad (4 directions)', 'A/B Buttons', 'Start/Select'];
      features.scene = ['Scene Manager (banked)', 'Fade Transition', 'Slide Transition', 'Wipe Transition'];
    } else if (bits === 16) {
      features.rendering = ['Tile-based BG (4 layers)', 'Affine/Rotation BG', 'Mode 7 Effects', 'Alpha Blending', 'Mosaic Effect', 'Windowing (2 hw windows)', 'Bitmap Modes (3-5)', '128 HW Sprites', '4BPP/8BPP Tiles', 'Sprite Scaling/Rotation'];
      features.physics = ['Pixel-perfect Collision', 'AABB Collision', 'Tile Collision Map', 'Platformer Physics (gravity, jump)', 'Free Movement (sub-pixel)', 'Slope Detection'];
      features.entity = ['Sprite Entity (variable size)', 'Affine Sprite (scalable)', 'Entity Pool (max ~80)', 'Component: Transform2D', 'Component: Sprite Renderer', 'Component: Affine Transform', 'Component: Collision (AABB/circle)', 'Component: Platformer Controller', 'Component: Particle Emitter', 'Component: Camera Follow', 'Component: AI (behavior tree)'];
      features.audio = ['6-Channel Mixer', 'PCM Streaming (DMA)', 'MOD/XM Tracker Playback', 'SFX + Music Coexistence', 'Volume/Pan Control'];
      features.save = ['SRAM / Flash / EEPROM', 'Checksum/CRC Validation', 'Multiple Save Slots', 'Auto-Save Support'];
      features.input = ['D-Pad', 'A/B/L/R/Start/Select', '10 Buttons Total'];
      features.scene = ['Scene Manager (flat memory)', 'Fade/Slide/Wipe/Iris Transitions', 'Parallax Scrolling Scenes', 'Mode 7 Scenes'];
    } else if (bits === 32) {
      features.rendering = ['Dual Screen Rendering', '2D Tile Engine (per screen)', '3D Polygon Engine (top screen)', 'Extended Palettes', 'Alpha Blending', 'Capture/Display Swap', 'Bitmap BG Modes', '128 Sprites per Screen', 'Affine Sprites', 'Texture Mapping (3D)', 'Matrix Stack Operations'];
      features.physics = ['2D AABB/Circle/Polygon Collision', '3D Bounding Box/Sphere', 'Raycasting', 'Platformer Physics', 'Top-Down Physics', '3D Camera System', 'Gravity/Velocity/Acceleration'];
      features.entity = ['2D Sprite Entity', '3D Mesh Entity', 'Entity Pool (large)', 'Component: Transform2D/3D', 'Component: Sprite/Mesh Renderer', 'Component: 3D Model', 'Component: Collision2D/3D', 'Component: Pathfinding (A*)', 'Component: Particle System', 'Component: Camera (2D/3D)', 'Component: Touch Input', 'Component: AI (goal-oriented)', 'Component: Network (wifi)'];
      features.audio = ['16-Channel Hardware Mixer', 'PCM8/PCM16/ADPCM', 'Streaming Audio', 'Per-Channel Volume/Pan', 'Sound Capture', 'Microphone Input'];
      features.save = ['EEPROM / Flash / NAND', 'Filesystem (FAT on Slot-1)', 'Multiple Save Files', 'Save Data Encryption'];
      features.input = ['D-Pad', 'A/B/X/Y/L/R/Start/Select', 'Touchscreen (bottom)', 'Microphone', 'Lid Open/Close'];
      features.scene = ['Dual-Screen Scene Manager', 'Scene Transitions (any effect)', '3D Scene Graph', 'Touch-based UI Scenes'];
    } else {
      features.rendering = ['3D Polygon Rendering (RDP)', 'Z-Buffering', 'Texture Mapping (TMEM 4KB)', 'Anti-Aliasing', 'Mip-Mapping', 'Tri-linear Filtering', 'Perspective Correction', 'Framebuffer Effects', 'Software 2D Sprites (RDP rects)', 'Multi-pass Rendering', 'Display Lists'];
      features.physics = ['Full 3D Physics', 'Bounding Box/Sphere/Capsule', 'Raycasting', 'Collision Detection (SAT)', 'Gravity/Forces/Impulse', '3D Camera System', 'Analog Input Physics'];
      features.entity = ['3D Actor Entity', 'Skeletal Animation', 'Entity Pool (dynamic)', 'Component: Transform3D', 'Component: Mesh Renderer', 'Component: Skeletal Mesh', 'Component: Collision3D', 'Component: Rigid Body', 'Component: AI (navmesh)', 'Component: Camera3D', 'Component: Particle System 3D', 'Component: Audio Source 3D'];
      features.audio = ['RSP Audio (microcode)', 'ADPCM Compression', '16-32 Voices', '44.1kHz Stereo', 'Positional Audio (3D)', 'Music Sequencer'];
      features.save = ['EEPROM / SRAM / Flash', 'Controller Pak (32KB)', 'Multiple Save Slots'];
      features.input = ['Analog Stick', 'D-Pad', 'A/B/Z/L/R/Start', 'C-Buttons (4)', 'Rumble Pak', '4 Controller Ports'];
      features.scene = ['3D Scene Manager', 'Level Streaming', 'Scene Graph (hierarchical)', 'Camera Transitions', 'Loading Screens'];
    }
    return features;
  }

  window.PlatformConfig = {
    platforms: platforms,
    current: currentPlatform,
    get: function() { return platforms[currentPlatform] || platforms.gbc; },
    set: function(id) {
      if (platforms[id]) {
        currentPlatform = id;
        this.current = id;
        window.dispatchEvent(new CustomEvent('platformChanged', { detail: id }));
      }
    },
    getAll: function() { return platforms; },
    getEngineFeatures: getEngineFeatures,
    getPlatformList: function() {
      return Object.keys(platforms).map(function(k) { return { id: k, name: platforms[k].name, bits: platforms[k].bits }; });
    }
  };

  var genres = {
    rpg: {
      id: 'rpg', name: 'RPG', description: 'Role-Playing Game with character progression, story, and turn-based or real-time combat',
      defaultFeatures: ['Character Stats', 'Inventory System', 'Quest Log', 'Dialogue System', 'Save/Load', 'Experience Points', 'Level Up'],
      requiredSystems: ['Stats Engine', 'Inventory Manager', 'Battle System', 'Text/Dialogue Engine', 'Save System', 'Map/World System'],
      defaultUI: { mainMenu: true, statusScreen: true, inventory: true, equipMenu: true, skillsMenu: true, questLog: true, minimap: true, dialogueBox: true },
      templateEntities: ['Hero', 'NPC', 'Enemy', 'Chest', 'Door', 'Shop Keeper', 'Quest Giver', 'Boss']
    },
    platformer: {
      id: 'platformer', name: 'Platformer', description: 'Side-scrolling or 3D platforming with jumping, running, and obstacle navigation',
      defaultFeatures: ['Jump Physics', 'Gravity System', 'Collision Detection', 'Moving Platforms', 'Collectibles', 'Lives/Health', 'Checkpoints'],
      requiredSystems: ['Physics Engine', 'Collision System', 'Camera System', 'Level Loader', 'Animation System'],
      defaultUI: { hud: true, livesCounter: true, scoreDisplay: true, timerDisplay: false, pauseMenu: true },
      templateEntities: ['Player', 'Platform', 'Moving Platform', 'Enemy', 'Collectible', 'Checkpoint', 'Spring', 'Spike']
    },
    action: {
      id: 'action', name: 'Action/Adventure', description: 'Action-oriented gameplay with exploration, combat, and puzzle-solving',
      defaultFeatures: ['Real-time Combat', 'Exploration', 'Puzzle Mechanics', 'Health System', 'Inventory', 'Map System', 'Cutscenes'],
      requiredSystems: ['Combat System', 'Physics Engine', 'Camera System', 'Inventory Manager', 'Map System', 'Cutscene Engine'],
      defaultUI: { hud: true, healthBar: true, inventory: true, minimap: true, pauseMenu: true, dialogueBox: true },
      templateEntities: ['Player', 'Enemy', 'NPC', 'Collectible', 'Destructible', 'Trigger Zone', 'Boss', 'Projectile']
    },
    adventure: {
      id: 'adventure', name: 'Adventure', description: 'Story-driven game focused on exploration, puzzles, and narrative',
      defaultFeatures: ['Dialogue Trees', 'Puzzle Mechanics', 'Inventory Puzzles', 'Exploration', 'Cutscenes', 'Journal/Notes'],
      requiredSystems: ['Dialogue Engine', 'Puzzle System', 'Inventory Manager', 'Cutscene Engine', 'Save System'],
      defaultUI: { dialogueBox: true, inventory: true, journal: true, pauseMenu: true },
      templateEntities: ['Player', 'NPC', 'Interactive Object', 'Puzzle Element', 'Door', 'Key Item', 'Trigger Zone']
    },
    shooter: {
      id: 'shooter', name: 'Shooter (Top-Down)', description: 'Top-down or twin-stick shooter with projectile combat',
      defaultFeatures: ['Projectile System', 'Weapon Types', 'Ammo System', 'Enemy Waves', 'Power-ups', 'Score System', 'Screen Shake'],
      requiredSystems: ['Projectile Manager', 'Collision System', 'Wave Spawner', 'Weapon System', 'Particle System'],
      defaultUI: { hud: true, healthBar: true, ammoCounter: true, scoreDisplay: true, weaponDisplay: true, pauseMenu: true },
      templateEntities: ['Player Ship', 'Enemy', 'Bullet', 'Power-up', 'Boss', 'Explosion', 'Asteroid', 'Pickup']
    },
    racing: {
      id: 'racing', name: 'Racing', description: 'Vehicle-based racing with tracks, opponents, and speed mechanics',
      defaultFeatures: ['Vehicle Physics', 'Track System', 'Lap Counter', 'Speed/Drift Mechanics', 'AI Opponents', 'Boost/Items', 'Position Tracking'],
      requiredSystems: ['Vehicle Physics', 'Track System', 'AI Driver', 'Camera System', 'Lap/Position Manager'],
      defaultUI: { hud: true, speedometer: true, minimap: true, lapCounter: true, positionDisplay: true, timerDisplay: true },
      templateEntities: ['Player Vehicle', 'AI Vehicle', 'Track Segment', 'Checkpoint', 'Item Box', 'Boost Pad', 'Obstacle', 'Finish Line']
    },
    puzzle: {
      id: 'puzzle', name: 'Puzzle', description: 'Logic and puzzle-solving focused gameplay',
      defaultFeatures: ['Puzzle Mechanics', 'Level Progression', 'Undo/Redo', 'Hint System', 'Score/Star Rating', 'Timer (optional)'],
      requiredSystems: ['Puzzle Logic Engine', 'Level Manager', 'Undo System', 'Score System'],
      defaultUI: { hud: true, levelSelect: true, scoreDisplay: true, hintButton: true, undoButton: true, pauseMenu: true },
      templateEntities: ['Puzzle Piece', 'Grid Cell', 'Movable Block', 'Target', 'Switch', 'Gate', 'Collectible Star']
    },
    fighting: {
      id: 'fighting', name: 'Fighting', description: '1v1 or team-based fighting game with combo systems',
      defaultFeatures: ['Combo System', 'Health Bars', 'Special Moves', 'Block/Parry', 'Rounds', 'Character Select', 'Hitbox System'],
      requiredSystems: ['Fighting Engine', 'Hitbox/Hurtbox System', 'Combo System', 'Input Buffer', 'Animation System'],
      defaultUI: { hud: true, healthBars: true, comboCounter: true, timerDisplay: true, roundDisplay: true, characterSelect: true },
      templateEntities: ['Fighter', 'Projectile', 'Hit Effect', 'Stage Element', 'Announcer Text']
    },
    strategy: {
      id: 'strategy', name: 'Strategy/Tactics', description: 'Turn-based or real-time strategy with unit management and tactical combat',
      defaultFeatures: ['Grid/Hex Map', 'Unit Management', 'Turn System', 'Resource Management', 'Fog of War', 'AI Opponents', 'Formation System'],
      requiredSystems: ['Grid System', 'Turn Manager', 'Unit Manager', 'AI System', 'Pathfinding', 'Resource Manager'],
      defaultUI: { hud: true, unitInfo: true, minimap: true, resourceDisplay: true, turnIndicator: true, actionMenu: true },
      templateEntities: ['Unit', 'Building', 'Resource Node', 'Terrain Tile', 'Cursor', 'Effect Zone', 'Commander']
    },
    simulation: {
      id: 'simulation', name: 'Simulation', description: 'Simulation of real-world systems, building, or management',
      defaultFeatures: ['Economy System', 'Building/Placement', 'Time Progression', 'Resource Management', 'Population/Entity Management', 'Upgrades'],
      requiredSystems: ['Economy Engine', 'Building System', 'Time Manager', 'Resource Manager', 'Population System'],
      defaultUI: { hud: true, resourceDisplay: true, buildMenu: true, infoPanel: true, minimap: true, speedControls: true },
      templateEntities: ['Building', 'Citizen/Agent', 'Resource', 'Vehicle', 'Road/Path', 'Zone', 'Decoration']
    },
    horror: {
      id: 'horror', name: 'Horror/Survival', description: 'Horror-themed game with resource scarcity, tension, and survival mechanics',
      defaultFeatures: ['Limited Resources', 'Inventory Management', 'Atmosphere/Lighting', 'Jump Scares', 'Puzzle Elements', 'Safe Rooms', 'Sanity System'],
      requiredSystems: ['Inventory Manager', 'Lighting System', 'Audio Ambiance', 'AI (stalker/patrol)', 'Save System'],
      defaultUI: { hud: true, healthDisplay: true, inventory: true, staminaBar: true, itemDisplay: true },
      templateEntities: ['Player', 'Monster', 'Pickup', 'Door', 'Key', 'Save Point', 'Trigger Zone', 'Light Source']
    },
    sports: {
      id: 'sports', name: 'Sports', description: 'Sports simulation or arcade sports gameplay',
      defaultFeatures: ['Sport-specific Rules', 'Score Tracking', 'Team Management', 'AI Opponents', 'Season/Tournament Mode', 'Replay System'],
      requiredSystems: ['Game Rules Engine', 'Physics Engine', 'AI System', 'Score Manager', 'Replay System'],
      defaultUI: { hud: true, scoreboard: true, timerDisplay: true, teamInfo: true, pauseMenu: true },
      templateEntities: ['Player Character', 'Ball/Puck', 'Goal', 'Referee', 'Spectator', 'Field Marker']
    },
    rhythm: {
      id: 'rhythm', name: 'Rhythm', description: 'Music and rhythm-based gameplay with timing mechanics',
      defaultFeatures: ['Beat Detection', 'Note Highway', 'Timing Windows', 'Combo System', 'Score/Grade System', 'Song Select', 'Difficulty Levels'],
      requiredSystems: ['Audio Sync Engine', 'Note Spawner', 'Timing System', 'Score System', 'Song Loader'],
      defaultUI: { hud: true, scoreDisplay: true, comboCounter: true, accuracyMeter: true, songProgress: true },
      templateEntities: ['Note', 'Hold Note', 'Lane', 'Hit Effect', 'Character/Dancer']
    },
    visual_novel: {
      id: 'visual_novel', name: 'Visual Novel', description: 'Story-driven game with branching narrative, character art, and dialogue choices',
      defaultFeatures: ['Branching Dialogue', 'Character Sprites', 'Background Art', 'Music/SFX', 'Save/Load', 'Text Log', 'Auto/Skip Mode', 'Choices/Routes'],
      requiredSystems: ['Script Engine', 'Text Renderer', 'Sprite Manager', 'Choice System', 'Save System', 'Audio Manager'],
      defaultUI: { dialogueBox: true, nameplate: true, choiceMenu: true, backlog: true, saveLoadMenu: true, settingsMenu: true },
      templateEntities: ['Character Sprite', 'Background', 'CG Image', 'Text Box', 'Choice Button']
    },
    roguelike: {
      id: 'roguelike', name: 'Roguelike', description: 'Procedurally generated dungeons with permadeath and turn-based or real-time combat',
      defaultFeatures: ['Procedural Generation', 'Permadeath', 'Random Loot', 'Turn-based Combat', 'Dungeon Crawling', 'Meta-progression', 'Run-based Structure'],
      requiredSystems: ['Dungeon Generator', 'Loot System', 'Combat System', 'FOV/Visibility', 'Stats Engine', 'Meta-progression Manager'],
      defaultUI: { hud: true, healthBar: true, inventory: true, minimap: true, floorDisplay: true, logWindow: true },
      templateEntities: ['Player', 'Enemy', 'Chest', 'Trap', 'Stairs', 'Item', 'Shop', 'Boss']
    },
    mmorpg: {
      id: 'mmorpg', name: 'MMORPG', description: 'Massively multiplayer online RPG with persistent world and social features',
      defaultFeatures: ['Persistent World', 'Character Classes', 'Party System', 'Chat/Social', 'Trading', 'Guilds', 'PvE/PvP', 'Quests', 'Crafting', 'Auction House'],
      requiredSystems: ['Network Engine', 'Database (persistent)', 'Chat System', 'Party/Guild Manager', 'Quest System', 'Trading System', 'Combat System', 'World Server'],
      defaultUI: { hud: true, chatBox: true, partyFrame: true, minimap: true, inventory: true, questTracker: true, hotbar: true, targetFrame: true },
      templateEntities: ['Player Character', 'NPC', 'Monster', 'Quest Giver', 'Merchant', 'Loot Drop', 'Portal', 'World Boss']
    },
    sandbox: {
      id: 'sandbox', name: 'Sandbox', description: 'Open-ended gameplay with building, crafting, and exploration',
      defaultFeatures: ['Block/Voxel World', 'Crafting System', 'Building/Placement', 'Day/Night Cycle', 'Inventory', 'Resource Gathering', 'Procedural World'],
      requiredSystems: ['Voxel/Grid Engine', 'Crafting System', 'Inventory Manager', 'World Generator', 'Physics Engine', 'Save System'],
      defaultUI: { hud: true, inventory: true, craftingMenu: true, hotbar: true, healthBar: true, minimap: false },
      templateEntities: ['Player', 'Block', 'Item', 'Mob', 'Tool', 'Workbench', 'Chest', 'Torch']
    },
    metroidvania: {
      id: 'metroidvania', name: 'Metroidvania', description: 'Exploration-focused 2D action with ability-gated progression',
      defaultFeatures: ['Interconnected Map', 'Ability Gating', 'Backtracking', 'Power-ups/Upgrades', 'Boss Fights', 'Map Reveal', 'Save Rooms'],
      requiredSystems: ['Map System', 'Ability Manager', 'Combat System', 'Physics Engine', 'Camera System', 'Save System'],
      defaultUI: { hud: true, healthBar: true, abilityDisplay: true, minimap: true, mapScreen: true, pauseMenu: true },
      templateEntities: ['Player', 'Enemy', 'Boss', 'Power-up', 'Save Point', 'Map Room', 'Breakable Wall', 'Door']
    },
    rpg_maker: {
      id: 'rpg_maker', name: 'RPG Maker Style', description: 'Classic RPG Maker-style tile-based RPG with event system',
      defaultFeatures: ['Tile Map Editor', 'Event System', 'Database (actors, items, skills)', 'Battle System (front/side)', 'Character Generator', 'Common Events', 'Switches/Variables'],
      requiredSystems: ['Tile Map Engine', 'Event Interpreter', 'Database System', 'Battle System', 'Message System', 'Save System'],
      defaultUI: { mapEditor: true, eventEditor: true, database: true, tilePicker: true, playtestButton: true },
      templateEntities: ['Player', 'NPC', 'Chest', 'Door', 'Transfer Event', 'Battle Event', 'Shop Event', 'Inn Event']
    }
  };

  var currentGenre = 'rpg';

  window.GenreConfig = {
    genres: genres,
    current: currentGenre,
    get: function() { return genres[currentGenre] || genres.rpg; },
    set: function(id) {
      if (genres[id]) {
        currentGenre = id;
        this.current = id;
        window.dispatchEvent(new CustomEvent('genreChanged', { detail: id }));
      }
    },
    getAll: function() { return genres; }
  };
})();
