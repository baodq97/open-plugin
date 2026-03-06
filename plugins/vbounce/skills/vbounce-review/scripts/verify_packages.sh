#!/bin/bash
# verify_packages.sh - Verify all packages exist in registries
# Part of V-Bounce Review Agent

set -e

ERRORS=0
WARNINGS=0

echo "🔍 V-Bounce Package Verification"
echo "================================="

# Verify npm packages
if [ -f "package.json" ]; then
    echo ""
    echo "📦 Checking npm packages..."
    for pkg in $(jq -r '.dependencies // {} | keys[]' package.json 2>/dev/null); do
        if npm view "$pkg" version &>/dev/null; then
            echo "  ✅ $pkg"
        else
            echo "  ❌ HALLUCINATION: $pkg does not exist"
            ERRORS=$((ERRORS + 1))
        fi
    done
    
    for pkg in $(jq -r '.devDependencies // {} | keys[]' package.json 2>/dev/null); do
        if npm view "$pkg" version &>/dev/null; then
            echo "  ✅ $pkg (dev)"
        else
            echo "  ❌ HALLUCINATION: $pkg does not exist (dev)"
            ERRORS=$((ERRORS + 1))
        fi
    done
fi

# Verify Python packages
if [ -f "requirements.txt" ]; then
    echo ""
    echo "🐍 Checking Python packages..."
    while IFS= read -r line; do
        # Skip empty lines and comments
        [[ -z "$line" || "$line" =~ ^# ]] && continue
        
        # Extract package name (before ==, >=, etc.)
        pkg=$(echo "$line" | sed 's/[<>=!].*//' | tr -d '[:space:]')
        
        if pip index versions "$pkg" &>/dev/null; then
            echo "  ✅ $pkg"
        else
            echo "  ❌ HALLUCINATION: $pkg does not exist"
            ERRORS=$((ERRORS + 1))
        fi
    done < requirements.txt
fi

# Verify NuGet packages
if [ -f "*.csproj" ] 2>/dev/null; then
    echo ""
    echo "📦 Checking NuGet packages..."
    for csproj in *.csproj; do
        for pkg in $(grep -oP 'PackageReference Include="\K[^"]+' "$csproj" 2>/dev/null); do
            if dotnet package search "$pkg" --take 1 &>/dev/null; then
                echo "  ✅ $pkg"
            else
                echo "  ❌ HALLUCINATION: $pkg does not exist"
                ERRORS=$((ERRORS + 1))
            fi
        done
    done
fi

echo ""
echo "================================="
if [ $ERRORS -gt 0 ]; then
    echo "❌ FAILED: $ERRORS hallucinated packages found"
    exit 1
else
    echo "✅ PASSED: All packages verified"
    exit 0
fi
