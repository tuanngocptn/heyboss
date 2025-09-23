'use client';
import Link from "next/link";
import { useState } from "react";
import { use } from "react";

interface BossData {
  name: string;
  company: string;
  position: string;
  rating: number;
  totalReports: number;
  categories: Record<string, number>;
  complaints: string[];
  comments: Array<{
    id: number;
    text: string;
    anonymous: boolean;
  }>;
}

const mockBossData: Record<string, BossData> = {
  'john-doe-acme': {
    name: 'John Doe',
    company: 'Acme Corp',
    position: 'Senior Engineering Manager',
    rating: 1,
    totalReports: 12,
    categories: {
      'Credit Stealing': 9,
      'Impossible Deadlines': 8,
      'Public Humiliation': 6,
      'Micromanagement': 7,
      'Blame Shifting': 10
    },
    complaints: [
      "Consistently takes credit for team's innovative solutions and presents them to upper management as his own ideas",
      "Sets unrealistic deadlines knowing they're impossible, then uses failures as ammunition for performance reviews",
      "Creates a culture of fear where team members are afraid to speak up in meetings",
      "Excludes senior developers from architecture decisions while blaming them for implementation issues"
    ],
    comments: [
      {
        id: 1,
        text: "Worked under John for 2 years. The Sunday scaries were real. He would change project requirements every week and then blame us for being behind schedule.",
        anonymous: true
      },
      {
        id: 2,
        text: "I developed anxiety disorder working in his team. The constant criticism and public embarrassment in team meetings destroyed my confidence.",
        anonymous: true
      },
      {
        id: 3,
        text: "John stole my machine learning algorithm idea and presented it to the CEO as his own innovation. I had all the documentation proving it was my work, but HR did nothing.",
        anonymous: true
      }
    ]
  },
  'sarah-wilson-tech-solutions': {
    name: 'Sarah Wilson',
    company: 'Tech Solutions Inc',
    position: 'Product Manager',
    rating: 2,
    totalReports: 8,
    categories: {
      'Micromanagement': 8,
      'Lack of Support': 6,
      'Poor Communication': 7,
      'Unrealistic Expectations': 5
    },
    complaints: [
      "Micromanages every task while simultaneously blaming team for lack of initiative and independence",
      "Refuses to provide clear requirements but criticizes when deliverables don't match her unstated expectations",
      "Takes credit for successful product launches while blaming development team for any issues"
    ],
    comments: [
      {
        id: 1,
        text: "Sarah would ask for hourly updates on tasks that should take days to complete. The constant interruptions made it impossible to do actual work.",
        anonymous: true
      }
    ]
  }
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl ${
            star <= rating ? 'text-yellow-500' : 'text-gray-400'
          }`}
        >
          ★
        </span>
      ))}
      <span className="ml-4 px-4 py-2 bg-red-600 text-white text-sm rounded-full font-semibold uppercase tracking-wide">
        TOXIC
      </span>
    </div>
  );
};

const CategoryBar = ({ category, count, maxCount }: { category: string; count: number; maxCount: number }) => {
  const percentage = (count / maxCount) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-300">{category}</span>
        <span className="text-sm text-gray-400">{count} reports</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-red-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function BossProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(mockBossData[resolvedParams.id]?.comments || []);

  const boss = mockBossData[resolvedParams.id];

  if (!boss) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Boss Not Found</h1>
          <Link href="/directory" className="text-red-500 hover:underline">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const maxCategoryCount = Math.max(...Object.values(boss.categories).map(Number));

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        text: newComment.trim(),
        anonymous: true
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-red-500">HeyBoss</Link>
            <div className="flex space-x-4">
              <Link
                href="/directory"
                className="px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Back to Directory
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="px-6 py-12 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{boss.name}</h1>
              <p className="text-xl text-gray-300 mb-2">{boss.position}</p>
              <p className="text-lg text-gray-400 mb-4">{boss.company}</p>
              <StarRating rating={boss.rating} />
            </div>
            <div className="text-center lg:text-right">
              <div className="text-3xl font-bold text-red-500 mb-1">{boss.totalReports}</div>
              <div className="text-gray-400">Total Reports</div>
              <button className="mt-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                Report This Boss
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Boss Information Section */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Reported Issues</h2>

          {/* Category Breakdown */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-200">Issue Categories</h3>
              {Object.entries(boss.categories).map(([category, count]) => (
                <CategoryBar
                  key={category}
                  category={category}
                  count={count as number}
                  maxCount={maxCategoryCount}
                />
              ))}
            </div>

            {/* Specific Complaints */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-200">Detailed Complaints</h3>
              <ul className="space-y-4">
                {boss.complaints.map((complaint: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-600 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                      <span className="text-white text-sm">!</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{complaint}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting Documents Section */}
      <section className="px-6 py-12 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Supporting Documents</h2>
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-600 rounded-lg">
              <div className="text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold mb-2">PDF Viewer</h3>
                <p className="text-gray-400 mb-4">
    &quot;That Toxic Boss Is Destroying You - Take Back Your Power.pdf&quot;
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anonymous Comments Section */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Anonymous Comments</h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-12">
            <div className="bg-gray-800 rounded-lg p-6">
              <label htmlFor="comment" className="block text-lg font-medium mb-4">
    Share your experience anonymously:
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Your experience will be posted anonymously. Help others by sharing what working with this boss was like..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-400">
                  Your comment will be posted anonymously
                </p>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newComment.trim()}
                >
                  Post Anonymously
                </button>
              </div>
            </div>
          </form>

          {/* Existing Comments */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-300 text-sm">👤</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-300">Anonymous User</span>
                    </div>
                    <p className="text-gray-200 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-4">💬</div>
              <p>No comments yet. Be the first to share your experience.</p>
            </div>
          )}
        </div>
      </section>

      {/* Help Section */}
      <section className="px-6 py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Dealing with a Similar Situation?</h2>
          <p className="text-xl text-gray-300 mb-8">
            You're not alone. Get the tools and strategies you need to protect yourself and take back your power.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Get Help Now
          </Link>
        </div>
      </section>
    </div>
  );
}