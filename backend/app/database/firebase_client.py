"""
database/firebase_client.py

Firebase Admin SDK initialization and Realtime Database client for FreshGuard AI.
Provides real-time synchronized storage alongside or in place of SQLite.
"""

import os
import logging
from pathlib import Path
from typing import Optional, Any
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, db

logger = logging.getLogger("freshguard.firebase")

# Load environment variables from backend/.env or current working directory
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

FIREBASE_DATABASE_URL = os.getenv(
    "FIREBASE_DATABASE_URL",
    "https://foodfreshnessmonitor-default-rtdb.firebaseio.com"
)
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "./firebase-service-account.json")

_firebase_initialized = False


def init_firebase() -> bool:
    """
    Initialize Firebase Admin SDK.
    Returns True if successfully initialized, False otherwise.
    """
    global _firebase_initialized

    if _firebase_initialized:
        return True

    if firebase_admin._apps:
        _firebase_initialized = True
        return True

    cred = None
    cred_path = Path(FIREBASE_CREDENTIALS_PATH)
    if not cred_path.is_absolute():
        # Check relative to backend directory first
        backend_dir = Path(__file__).resolve().parent.parent.parent
        possible_path = backend_dir / cred_path
        if possible_path.exists():
            cred_path = possible_path

    if cred_path.exists() and cred_path.is_file():
        try:
            logger.info("Initializing Firebase with credentials from %s", cred_path)
            cred = credentials.Certificate(str(cred_path))
        except Exception as e:
            logger.error("Failed to load Firebase credentials from %s: %s", cred_path, e)
    else:
        logger.warning(
            "Firebase credentials file not found at '%s'. "
            "Please download your service account JSON from Firebase Console and place it at backend/firebase-service-account.json "
            "to enable authenticated Firebase Realtime Database writes.",
            FIREBASE_CREDENTIALS_PATH
        )
        try:
            # Try default credentials (e.g. if running in GCP or GOOGLE_APPLICATION_CREDENTIALS is set)
            cred = credentials.ApplicationDefault()
            logger.info("Using Google Application Default Credentials for Firebase.")
        except Exception:
            cred = None

    if not cred:
        logger.warning("Firebase Admin SDK running in uninitialized/fallback mode.")
        _firebase_initialized = False
        return False

    try:
        firebase_admin.initialize_app(cred, {
            "databaseURL": FIREBASE_DATABASE_URL
        })
        _firebase_initialized = True
        logger.info("Firebase Admin initialized successfully with databaseURL: %s", FIREBASE_DATABASE_URL)
        return True
    except Exception as e:
        logger.error("Error initializing Firebase Admin app: %s", e)
        _firebase_initialized = False
        return False


def is_firebase_ready() -> bool:
    """Check if Firebase Admin is currently initialized."""
    return _firebase_initialized and bool(firebase_admin._apps)


def get_firebase_ref(path: str = "/") -> Optional[db.Reference]:
    """
    Return a Firebase Realtime Database reference for the specified path,
    or None if Firebase is not initialized.
    """
    if not is_firebase_ready():
        if not init_firebase():
            return None
    try:
        return db.reference(path)
    except Exception as e:
        logger.error("Error accessing Firebase ref '%s': %s", path, e)
        return None
