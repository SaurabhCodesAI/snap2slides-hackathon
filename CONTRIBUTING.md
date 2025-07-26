# Contributing to Snap2Slides

Thank you for your interest in contributing to Snap2Slides! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community](#community)

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### Our Standards

**Examples of behavior that contributes to a positive environment:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 3+
- Git configured with your name and email
- A GitHub account
- Basic knowledge of TypeScript, React, and Next.js

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/snap2slides.git
   cd snap2slides
   ```

2. **Set up the development environment**
   ```bash
   # Install dependencies
   npm install
   
   # Copy environment template
   cp .env.example .env.local
   
   # Configure your API keys in .env.local
   # See README.md for detailed setup instructions
   ```

3. **Verify setup**
   ```bash
   # Run tests
   npm run test
   
   # Start development server
   npm run dev
   
   # Check code quality
   npm run lint
   npm run type-check
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

#### 🐛 **Bug Fixes**
- Fix existing issues or bugs
- Add tests to prevent regression
- Update documentation if necessary

#### ✨ **New Features**
- Implement new functionality
- Add comprehensive tests
- Update documentation and examples

#### 📚 **Documentation**
- Improve existing documentation
- Add new guides or tutorials
- Fix typos or unclear explanations

#### 🎨 **UI/UX Improvements**
- Enhance user interface
- Improve accessibility
- Optimize user experience

#### ⚡ **Performance Optimizations**
- Improve app performance
- Reduce bundle size
- Optimize database queries

#### 🧪 **Tests**
- Add missing test coverage
- Improve existing tests
- Add E2E tests for new features

### Contribution Workflow

1. **Check existing issues** to avoid duplicate work
2. **Create an issue** for discussion (for major changes)
3. **Fork and clone** the repository
4. **Create a feature branch** from `main`
5. **Make your changes** following our code standards
6. **Add tests** for new functionality
7. **Run quality checks** locally
8. **Commit your changes** using conventional commits
9. **Push to your fork** and create a pull request
10. **Respond to feedback** during code review

## 🏗️ Code Standards

### TypeScript Standards

```typescript
// ✅ Good: Strict typing with explicit interfaces
interface SlideData {
  readonly id: string;
  title: string;
  content: readonly string[];
  metadata?: {
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };
}

// ✅ Good: Use const assertions and readonly
const SLIDE_THEMES = ['modern', 'classic', 'minimal'] as const;
type SlideTheme = typeof SLIDE_THEMES[number];

// ❌ Avoid: Any types and mutable arrays
const badData: any = { items: string[] };
```

### React Component Standards

```typescript
// ✅ Good: Proper component structure
interface SlideEditorProps {
  readonly slide: SlideData;
  readonly onUpdate: (slide: SlideData) => void;
  readonly disabled?: boolean;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({
  slide,
  onUpdate,
  disabled = false
}) => {
  // Use custom hooks for complex logic
  const { isEditing, startEdit, saveEdit } = useSlideEditor(slide);
  
  // Memoize expensive calculations
  const processedContent = useMemo(
    () => processSlideContent(slide.content),
    [slide.content]
  );
  
  return (
    <div className="slide-editor" data-testid="slide-editor">
      {/* Component JSX */}
    </div>
  );
};
```

### CSS/Styling Standards

```css
/* ✅ Good: Use Tailwind utilities with semantic naming */
.slide-editor {
  @apply flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-sm;
}

.slide-editor--editing {
  @apply ring-2 ring-blue-500 ring-opacity-50;
}

/* ✅ Good: Custom CSS for complex interactions */
.slide-transition {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ❌ Avoid: Inline styles for complex styling */
```

### API Route Standards

```typescript
// ✅ Good: Proper error handling and validation
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const validatedData = SlideSchema.parse(body);
    
    const result = await processSlide(validatedData);
    
    return Response.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    // Log error for monitoring
    console.error('Slide processing error:', error);
    
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 🧪 Testing Requirements

### Test Coverage Standards
- **Minimum coverage**: 80% overall
- **Critical paths**: 95% coverage required
- **New features**: Must include comprehensive tests

### Testing Types

#### Unit Tests (Jest + React Testing Library)
```typescript
// ✅ Good: Comprehensive component testing
describe('SlideEditor', () => {
  it('should render slide content correctly', () => {
    const mockSlide = createMockSlide();
    render(<SlideEditor slide={mockSlide} onUpdate={jest.fn()} />);
    
    expect(screen.getByTestId('slide-editor')).toBeInTheDocument();
    expect(screen.getByText(mockSlide.title)).toBeInTheDocument();
  });
  
  it('should call onUpdate when slide is modified', async () => {
    const mockOnUpdate = jest.fn();
    const mockSlide = createMockSlide();
    
    render(<SlideEditor slide={mockSlide} onUpdate={mockOnUpdate} />);
    
    const titleInput = screen.getByRole('textbox', { name: /title/i });
    await user.type(titleInput, ' Updated');
    
    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockSlide,
      title: 'Original Title Updated'
    });
  });
});
```

#### E2E Tests (Playwright)
```typescript
// ✅ Good: User journey testing
test('user can create and export presentation', async ({ page }) => {
  await page.goto('/');
  
  // Upload image
  await page.setInputFiles('[data-testid="file-upload"]', 'test-image.jpg');
  
  // Wait for AI processing
  await page.waitForSelector('[data-testid="slide-preview"]');
  
  // Edit slide content
  await page.click('[data-testid="slide-title"]');
  await page.fill('[data-testid="title-input"]', 'My Presentation');
  
  // Export as PDF
  await page.click('[data-testid="export-button"]');
  await page.click('[data-testid="export-pdf"]');
  
  // Verify download
  const downloadPromise = page.waitForEvent('download');
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
});
```

#### Accessibility Tests
```typescript
// ✅ Good: A11y testing with axe-core
test('slide editor is accessible', async () => {
  const { container } = render(<SlideEditor slide={mockSlide} onUpdate={jest.fn()} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 🔄 Pull Request Process

### Before Submitting

1. **Run all quality checks**:
   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run test:e2e
   npm run test:a11y
   ```

2. **Update documentation** if necessary
3. **Add changeset** for version tracking:
   ```bash
   npm run changeset
   ```

### PR Requirements

#### Title and Description
- Use conventional commit format: `feat: add slide animation controls`
- Provide clear description of changes
- Reference related issues: `Fixes #123`
- Include screenshots for UI changes

#### Code Review Checklist
- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or properly documented)
- [ ] Performance impact is considered
- [ ] Accessibility is maintained
- [ ] Security implications are reviewed

### Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages:

```bash
# Features
feat: add drag-and-drop slide reordering
feat(api): implement slide sharing endpoints

# Bug fixes
fix: resolve image upload timeout issues
fix(editor): prevent text overflow in slide titles

# Documentation
docs: update API documentation
docs(contributing): add testing guidelines

# Refactoring
refactor: optimize slide rendering performance
refactor(types): improve slide interface definitions

# Tests
test: add E2E tests for export functionality
test(unit): increase coverage for slide editor

# Chores
chore: update dependencies
chore(ci): improve build performance
```

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, please include:

1. **Clear title** describing the issue
2. **Environment details**:
   - OS and version
   - Browser and version
   - Node.js version
   - Package versions
3. **Steps to reproduce** the issue
4. **Expected behavior**
5. **Actual behavior**
6. **Screenshots or videos** if applicable
7. **Error messages** from console/logs

Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

### Feature Requests

For feature requests, provide:

1. **Problem description** - What problem does this solve?
2. **Proposed solution** - How should it work?
3. **Alternative solutions** - Other ways to solve this?
4. **Use cases** - Who would benefit?
5. **Implementation ideas** - Technical approach?

Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md).

## 💬 Community

### Communication Channels

- **GitHub Discussions**: General questions and ideas
- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Real-time chat and support
- **Twitter**: Updates and announcements

### Getting Help

1. **Check documentation** and README first
2. **Search existing issues** for similar problems
3. **Ask in GitHub Discussions** for general questions
4. **Join our Discord** for real-time help
5. **Create an issue** for bugs or feature requests

### Recognition

We appreciate all contributions! Contributors will be:
- Listed in our `CONTRIBUTORS.md` file
- Mentioned in release notes for significant contributions
- Eligible for special contributor badges
- Invited to join our contributor Discord channel

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Snap2Slides! Your contributions help make this project better for everyone. 🚀
