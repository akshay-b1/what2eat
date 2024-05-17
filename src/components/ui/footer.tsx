import React, { useState } from 'react';
import Link from "next/link"

export default function Component() {
  const [showModal, setShowModal] = useState(false);

  return (
    <footer className="bg-gray-900 px-4 py-3 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <p>© 2024 What2Eat. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a className="hover:text-gray-400" onClick={() => setShowModal(true)}>
              Privacy Policy
            </a>
          </div>
        </div>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
              <p>
                We only store session and login information, and do we not share any data.<br/>
                Your IP will be used for food recommendations, but we do not do anything else with that information. <br />
                We are not responsible for any data breaches, but we will do our best to prevent them.
              </p>
            </div>
          </div>
        )}
      </footer>
  )
}