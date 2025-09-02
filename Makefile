.PHONY: help install dev build preview test test-ui lint lint-fix format clean

# Default target
help:
	@echo "🚀 BETTROI BOS - Available Commands:"
	@echo ""
	@echo "📦 Setup:"
	@echo "  install     Install dependencies"
	@echo "  setup       Setup development environment"
	@echo ""
	@echo "🔄 Development:"
	@echo "  dev         Start development server"
	@echo "  build       Build for production"
	@echo "  preview     Preview production build"
	@echo ""
	@echo "🧪 Testing:"
	@echo "  test        Run tests"
	@echo "  test-ui     Run tests with UI"
	@echo "  test-cov    Run tests with coverage"
	@echo ""
	@echo "✨ Code Quality:"
	@echo "  lint        Run ESLint"
	@echo "  lint-fix    Fix ESLint issues"
	@echo "  format      Format code with Prettier"
	@echo ""
	@echo "🧹 Maintenance:"
	@echo "  clean       Clean build artifacts"
	@echo "  reset       Reset development environment"
	@echo ""

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install
	@echo "✅ Dependencies installed successfully!"

# Setup development environment
setup: install
	@echo "🔧 Setting up development environment..."
	@if [ ! -f .env ]; then \
		echo "📝 Creating .env file from template..."; \
		cp env.example .env; \
		echo "⚠️  Please update .env with your actual values"; \
	else \
		echo "✅ .env file already exists"; \
	fi
	@echo "✅ Development environment setup complete!"

# Start development server
dev:
	@echo "🚀 Starting development server..."
	npm run dev

# Build for production
build:
	@echo "🏗️  Building for production..."
	npm run build
	@echo "✅ Build complete! Output in dist/ directory"

# Preview production build
preview:
	@echo "👀 Previewing production build..."
	npm run preview

# Run tests
test:
	@echo "🧪 Running tests..."
	npm run test

# Run tests with UI
test-ui:
	@echo "🧪 Running tests with UI..."
	npm run test:ui

# Run tests with coverage
test-cov:
	@echo "🧪 Running tests with coverage..."
	npm run test:coverage

# Run ESLint
lint:
	@echo "🔍 Running ESLint..."
	npm run lint

# Fix ESLint issues
lint-fix:
	@echo "🔧 Fixing ESLint issues..."
	npm run lint:fix

# Format code
format:
	@echo "✨ Formatting code..."
	npm run format

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf dist/
	rm -rf node_modules/.vite/
	@echo "✅ Clean complete!"

# Reset development environment
reset: clean
	@echo "🔄 Resetting development environment..."
	rm -rf node_modules/
	rm -f package-lock.json
	@echo "✅ Reset complete! Run 'make setup' to reinstall"

# Quick development workflow
dev-workflow: lint-fix format test dev

# Production deployment check
deploy-check: clean install build test lint
	@echo "✅ All checks passed! Ready for deployment"

# Help with common issues
troubleshoot:
	@echo "🔧 Common Troubleshooting Steps:"
	@echo ""
	@echo "1. If you get dependency errors:"
	@echo "   make reset && make setup"
	@echo ""
	@echo "2. If build fails:"
	@echo "   make clean && make build"
	@echo ""
	@echo "3. If tests fail:"
	@echo "   make lint-fix && make test"
	@echo ""
	@echo "4. If dev server won't start:"
	@echo "   make clean && make dev"
