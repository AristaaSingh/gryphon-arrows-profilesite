// Run with: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  cleanLine,
  cleanMessage,
  validateContact,
  validateEmail,
  validateMessage,
  validateName,
} from "./contactValidation.ts";

const good = {
  firstName: "Aristaa",
  lastName: "O'Neil-Singh",
  email: "aristaa@example.com",
  message: "Hi, I would like to know how to join the team this term.",
};

test("accepts a normal enquiry", () => {
  assert.equal(validateContact(good).ok, true);
});

test("accepts real-world names", () => {
  for (const n of [
    "Mary-Jane",
    "José",
    "Zoë",
    "O'Brien",
    "Anne\u2011Marie",
    "李",
    "Dr. Who",
  ])
    assert.equal(validateName(n, "Name").ok, true, n);
});

test("rejects code, symbols and digits in names", () => {
  for (const n of [
    "<script>alert(1)</script>",
    "Robert'); DROP TABLE students;--",
    "{{7*7}}",
    "${process.env.KEY}",
    "admin123",
    "a@b.com",
    "x".repeat(61),
    "",
    "   ",
  ])
    assert.equal(validateName(n, "Name").ok, false, n);
});

test("rejects bad or injected email addresses", () => {
  for (const e of [
    "not-an-email",
    "a@b",
    "a@b..com",
    "a b@example.com",
    "victim@example.com\nBcc: spam@evil.com",
    "<script>@example.com",
    "a@example.com,b@example.com",
    "x".repeat(130) + "@example.com",
  ])
    assert.equal(validateEmail(e).ok, false, JSON.stringify(e));
  assert.equal(validateEmail("first.last+tag@sub.example.co.uk").ok, true);
});

test("rejects markup, script URLs and event handlers in the message", () => {
  for (const m of [
    "<script>alert('xss')</script> hello there",
    "hello <img src=x onerror=alert(1)>",
    "<b>bold</b> text here",
    "click javascript:alert(1) please",
    "data:text/html;base64,PHNjcmlwdD4= hi there",
    "my pic onerror=alert(1) thanks",
    "<!-- comment --> hello there",
  ])
    assert.equal(validateMessage(m).ok, false, m);
});

test("rejects spammy messages", () => {
  assert.equal(
    validateMessage("buy now http://a.com and http://b.com and www.c.com").ok,
    false,
  );
  assert.equal(validateMessage("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa").ok, false);
  assert.equal(validateMessage("12345 67890 !!!!!").ok, false);
  assert.equal(validateMessage("hi").ok, false);
  assert.equal(validateMessage("a ".repeat(200)).ok, false);
});

test("allows one link and ordinary punctuation", () => {
  assert.equal(
    validateMessage(
      "Our site is https://example.com - can we talk? (Thanks!) 2 < 3 is true.",
    ).ok,
    true,
  );
});

test("strips invisible characters and header-injection newlines", () => {
  assert.equal(cleanLine("Ada\r\nBcc: x@y.com\u202E\u200B"), "Ada Bcc: x@y.com");
  assert.equal(cleanMessage("a\u0000b\r\n\r\n\r\n\r\nc"), "ab\n\nc");
});
