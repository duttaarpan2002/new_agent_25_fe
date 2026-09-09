import React, { useState } from 'react';
import { Play, Sparkles, FileCode, CheckSquare, RefreshCw } from 'lucide-react';

interface ReviewControlsProps {
  onRunReview: (criteria: string, diff: string, language: string, framework: string) => void;
  isLoading: boolean;
}

const PRESET_SCENARIOS = [
  {
    name: '1. Clean Feature (Spring Boot)',
    criteria: '1. Customer email must contain @ symbol and be non-null.\n2. Service must return boolean valid status.',
    diff: `diff --git a/src/main/java/com/example/CustomerService.java b/src/main/java/com/example/CustomerService.java
new file mode 100644
--- /dev/null
+++ b/src/main/java/com/example/CustomerService.java
@@ -0,0 +1,10 @@
+package com.example;
+import org.springframework.stereotype.Service;
+
+@Service
+public class CustomerService {
+    public boolean isValidCustomer(String email) {
+        return email != null && email.contains("@");
+    }
+}`
  },
  {
    name: '2. SQL Injection Hazard (DO NOT PUSH)',
    criteria: '1. Customer lookup by email.\n2. Query database and return customer entity.',
    diff: `diff --git a/src/main/java/com/example/CustomerRepository.java b/src/main/java/com/example/CustomerRepository.java
--- a/src/main/java/com/example/CustomerRepository.java
+++ b/src/main/java/com/example/CustomerRepository.java
@@ -10,4 +10,6 @@
+    public User findByEmailRaw(String email) {
+        return entityManager.createQuery("SELECT u FROM User u WHERE u.email = '" + email + "'").getSingleResult();
+    }
+}`
  },
  {
    name: '3. Hardcoded Secret Leak (DO NOT PUSH)',
    criteria: '1. Configure S3 client properties.\n2. Set AWS authentication credentials.',
    diff: `diff --git a/src/main/resources/application.properties b/src/main/resources/application.properties
--- a/src/main/resources/application.properties
+++ b/src/main/resources/application.properties
@@ -1,2 +1,3 @@
+aws.access.key=AKIA1234567890EXAMPLE
+aws.region=us-east-1`
  },
  {
    name: '4. Missing Controller Validation',
    criteria: '1. Create customer endpoint.\n2. Reject invalid customer requests.',
    diff: `diff --git a/src/main/java/com/example/CustomerController.java b/src/main/java/com/example/CustomerController.java
--- a/src/main/java/com/example/CustomerController.java
+++ b/src/main/java/com/example/CustomerController.java
@@ -12,4 +12,6 @@
+    @PostMapping("/customers")
+    public ResponseEntity<User> createCustomer(@RequestBody CustomerDto dto) {
+        return ResponseEntity.ok(customerService.save(dto));
+    }
+}`
  },
  {
    name: '5. Python Flask SQL Injection (DO NOT PUSH)',
    criteria: '1. Endpoint to query user by username.\n2. Return user profile dictionary.',
    diff: `diff --git a/app/routes/users.py b/app/routes/users.py
new file mode 100644
--- /dev/null
+++ b/app/routes/users.py
@@ -0,0 +1,9 @@
+from flask import Blueprint, request, jsonify
+from app.database import db
+
+user_bp = Blueprint('users', __name__)
+
+@user_bp.route('/api/user', methods=['GET'])
+def get_user():
+    username = request.args.get('username')
+    user = db.session.execute(f"SELECT * FROM users WHERE username = '{username}'")
+    return jsonify({"user": user.fetchone()})`
  },
  {
    name: '6. Python Clean Service (Pytest & Pydantic)',
    criteria: '1. Validate customer registration email.\n2. Return sanitized customer payload.',
    diff: `diff --git a/app/services/customer.py b/app/services/customer.py
new file mode 100644
--- /dev/null
+++ b/app/services/customer.py
@@ -0,0 +1,11 @@
+import re
+from pydantic import BaseModel, EmailStr
+
+class CustomerRegisterDTO(BaseModel):
+    email: EmailStr
+    full_name: str
+
+def register_customer(payload: CustomerRegisterDTO) -> dict:
+    return {"email": payload.email.lower(), "name": payload.full_name.strip()}
+`
  }
];

export const ReviewControls: React.FC<ReviewControlsProps> = ({ onRunReview, isLoading }) => {
  const [criteria, setCriteria] = useState(PRESET_SCENARIOS[0].criteria);
  const [diff, setDiff] = useState(PRESET_SCENARIOS[0].diff);
  const [language, setLanguage] = useState('java');
  const [framework, setFramework] = useState('spring-boot');

  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = PRESET_SCENARIOS.find(s => s.name === e.target.value);
    if (selected) {
      setCriteria(selected.criteria);
      setDiff(selected.diff);
    }
  };

  return (
    <div className="glass-panel p-5 space-y-4">
      {/* Top Header & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-semibold text-white">Review Inputs & Workspace Scope</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Load Golden Scenario:</span>
          <select
            onChange={handleSelectPreset}
            className="text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            {PRESET_SCENARIOS.map(s => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Acceptance Criteria */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
              Acceptance Criteria (User Story / Jira Task)
            </label>
            <span className="text-[11px] text-slate-500">Plain text or bullet points</span>
          </div>
          <textarea
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
            rows={6}
            placeholder="Enter acceptance criteria or user story conditions..."
            className="w-full text-xs font-mono bg-slate-950/70 text-slate-200 border border-slate-800 rounded-lg p-3 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Git Diff */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              Local Git Diff (Working Tree / Staged Changes)
            </label>
            <span className="text-[11px] text-slate-500">Unified diff format</span>
          </div>
          <textarea
            value={diff}
            onChange={(e) => setDiff(e.target.value)}
            rows={6}
            placeholder="Paste unified git diff (or leave empty to let agent read local git)..."
            className="w-full text-xs font-mono bg-slate-950/70 text-slate-200 border border-slate-800 rounded-lg p-3 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Language, Framework & Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-2 py-1"
            >
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript / JavaScript</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Framework:</span>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-2 py-1"
            >
              <option value="spring-boot">Spring Boot</option>
              <option value="flask">Flask</option>
              <option value="react">React</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => onRunReview(criteria, diff, language, framework)}
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Running Multi-Agent Pre-Push Review...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              RUN PRE-PUSH REVIEW
            </>
          )}
        </button>
      </div>
    </div>
  );
};
