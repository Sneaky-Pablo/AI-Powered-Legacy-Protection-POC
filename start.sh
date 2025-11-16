#!/bin/bash

# 🚀 Quick Start Script for Legacy Protection Agent POC
# This script helps you get started quickly

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║         🛡️  Legacy Protection Agent - Quick Start  🛡️          ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found!"
    echo ""
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ .env.local created!"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your credentials:"
    echo "   - OPENAI_API_KEY"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_KEY"
    echo ""
    echo "📖 See SETUP.md for detailed instructions"
    echo ""
    read -p "Press Enter when you've configured .env.local..."
fi

echo "🔍 Checking environment variables..."
echo ""

# Source the .env.local file
export $(cat .env.local | grep -v '^#' | xargs)

# Check OpenAI
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY is not set"
    HAS_ERROR=true
else
    echo "✅ OPENAI_API_KEY is set"
fi

# Check Supabase URL
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL is not set"
    HAS_ERROR=true
else
    echo "✅ NEXT_PUBLIC_SUPABASE_URL is set"
fi

# Check Supabase Key
if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "❌ SUPABASE_SERVICE_KEY is not set"
    HAS_ERROR=true
else
    echo "✅ SUPABASE_SERVICE_KEY is set"
fi

echo ""

if [ "$HAS_ERROR" = true ]; then
    echo "⚠️  Please configure missing environment variables in .env.local"
    echo "📖 See SETUP.md for help"
    exit 1
fi

echo "✅ All environment variables are set!"
echo ""

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✅ Dependencies are installed!"
echo ""

echo "🚀 Starting development server..."
echo ""
echo "   Your app will be available at:"
echo "   👉 http://localhost:3000"
echo ""
echo "   Demo page:"
echo "   👉 http://localhost:3000/demo"
echo ""
echo "   API endpoint:"
echo "   👉 http://localhost:3000/api/generate-report"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
npm run dev
