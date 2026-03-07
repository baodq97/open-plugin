#!/usr/bin/env bash
# verify-structure.sh — Check that vbounce phase artifacts exist in workspace
# Usage: bash verify-structure.sh <workspace-dir> <phase>
# Example: bash verify-structure.sh ./workspace/run-20260307 requirements

set -euo pipefail

WORKSPACE="${1:?Usage: verify-structure.sh <workspace-dir> <phase>}"
PHASE="${2:?Usage: verify-structure.sh <workspace-dir> <phase>}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

check_file() {
    local file="$1"
    local desc="$2"
    if [ -f "$WORKSPACE/$file" ]; then
        local lines
        lines=$(wc -l < "$WORKSPACE/$file")
        if [ "$lines" -gt 5 ]; then
            printf "${GREEN}PASS${NC} %-40s (%d lines)\n" "$desc" "$lines"
            ((PASS++))
        else
            printf "${YELLOW}WARN${NC} %-40s (only %d lines — possibly incomplete)\n" "$desc" "$lines"
            ((WARN++))
        fi
    else
        printf "${RED}FAIL${NC} %-40s (file not found: %s)\n" "$desc" "$file"
        ((FAIL++))
    fi
}

check_content() {
    local file="$1"
    local pattern="$2"
    local desc="$3"
    if [ -f "$WORKSPACE/$file" ]; then
        if grep -qE "$pattern" "$WORKSPACE/$file"; then
            printf "${GREEN}PASS${NC} %-40s\n" "$desc"
            ((PASS++))
        else
            printf "${RED}FAIL${NC} %-40s (pattern not found: %s)\n" "$desc" "$pattern"
            ((FAIL++))
        fi
    else
        printf "${RED}FAIL${NC} %-40s (file missing)\n" "$desc"
        ((FAIL++))
    fi
}

echo "============================================"
echo "V-Bounce E2E Structure Verification"
echo "Phase: $PHASE"
echo "Workspace: $WORKSPACE"
echo "============================================"
echo ""

case "$PHASE" in
    requirements)
        check_file "requirements.md" "Requirements document"
        check_file "test-skeletons.md" "Test skeletons"
        check_file "traceability.md" "Traceability matrix"
        check_file "ambiguity-report.md" "Ambiguity report"
        check_content "requirements.md" "US-[0-9]+-[0-9]+" "User Story IDs present"
        check_content "requirements.md" "AC-" "Acceptance Criteria IDs present"
        check_content "requirements.md" "GIVEN" "GIVEN-WHEN-THEN format"
        check_content "requirements.md" "NFR-" "NFR IDs present"
        check_content "test-skeletons.md" "T-AC-" "Test skeleton IDs present"
        check_content "traceability.md" "US-" "Traceability links stories"
        check_content "ambiguity-report.md" "[Ss]core" "Ambiguity scores present"
        ;;
    design)
        check_content "." "STRIDE\|threat model" "STRIDE threat model"
        check_content "." "ADR\|Architecture Decision" "ADR present"
        check_content "." "endpoint\|route\|API" "API spec present"
        check_content "." "entity\|table\|schema" "Data model present"
        ;;
    implementation)
        echo "Checking src/ directory..."
        if [ -d "$WORKSPACE/src" ]; then
            local_count=$(find "$WORKSPACE/src" -name "*.ts" -o -name "*.js" | wc -l)
            printf "${GREEN}PASS${NC} %-40s (%d files)\n" "Source files exist" "$local_count"
            ((PASS++))
        else
            printf "${RED}FAIL${NC} %-40s\n" "src/ directory missing"
            ((FAIL++))
        fi
        echo "Checking test/ directory..."
        if [ -d "$WORKSPACE/test" ] || [ -d "$WORKSPACE/tests" ]; then
            printf "${GREEN}PASS${NC} %-40s\n" "Test directory exists"
            ((PASS++))
        else
            printf "${RED}FAIL${NC} %-40s\n" "test/ directory missing"
            ((FAIL++))
        fi
        ;;
    review)
        echo "Review artifacts are typically inline — check results.md manually"
        ;;
    testing)
        echo "Checking test coverage..."
        if [ -d "$WORKSPACE/test" ] || [ -d "$WORKSPACE/tests" ]; then
            local_count=$(find "$WORKSPACE/test" "$WORKSPACE/tests" -name "*.test.*" -o -name "*.spec.*" 2>/dev/null | wc -l)
            printf "${GREEN}PASS${NC} %-40s (%d test files)\n" "Test files present" "$local_count"
            ((PASS++))
        else
            printf "${YELLOW}WARN${NC} %-40s\n" "No test files found"
            ((WARN++))
        fi
        ;;
    deployment)
        echo "Checking deployment artifacts..."
        check_file "Dockerfile" "Dockerfile"
        ;;
    *)
        echo "Unknown phase: $PHASE"
        echo "Valid phases: requirements, design, implementation, review, testing, deployment"
        exit 1
        ;;
esac

echo ""
echo "============================================"
echo "Results: ${GREEN}${PASS} PASS${NC} | ${YELLOW}${WARN} WARN${NC} | ${RED}${FAIL} FAIL${NC}"
echo "============================================"

if [ "$FAIL" -gt 0 ]; then
    exit 1
fi
