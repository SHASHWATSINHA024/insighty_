from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random

def run_user_test(add_subs=[], delete_subs=[]):
    options = Options()
    options.add_argument("--start-maximized")
    driver = webdriver.Chrome(options=options)
    wait = WebDriverWait(driver, 20)

    # Generate unique user
    rand = random.randint(1000, 9999)
    username = f"user{rand}"
    email = f"{username}@example.com"
    password = "Test@1234"

    try:
        print(f"\n👤 Registering {username}")
        driver.get("http://localhost:3000/register")

        # Fill form
        wait.until(EC.presence_of_element_located((By.NAME, "username"))).send_keys(username)
        driver.find_element(By.NAME, "email").send_keys(email)
        driver.find_element(By.NAME, "password").send_keys(password)
        driver.find_element(By.NAME, "confirmPassword").send_keys(password)
        print("✅ Registration form filled")

        # Submit
        driver.find_element(By.XPATH, "//button[contains(text(), 'Create account')]").click()
        wait.until(EC.url_contains("/dashboard"))
        print("📥 Navigated to dashboard")

        # Open Preferences Modal
        wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Preferences')]"))).click()
        print("⚙️ Opened Preferences modal")

        # Add subreddits
        for sub in add_subs:
            input_box = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Enter subreddit name (e.g., programming)']")))
            input_box.clear()
            input_box.send_keys(sub)
            plus_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Add')]")))
            plus_button.click()
            print(f"➕ Added: {sub}")
            time.sleep(1)

        # Delete subreddits (if any exist in UI)
        for sub in delete_subs:
            try:
                delete_btn = wait.until(EC.element_to_be_clickable((By.XPATH, f"//span[contains(., 'r/{sub}')]/following-sibling::button")))
                delete_btn.click()
                print(f"🗑️ Deleted: {sub}")
                time.sleep(1)
            except:
                print(f"⚠️ Could not find r/{sub} to delete")

        # Save preferences
        save_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Save Preferences')]")))
        save_button.click()
        print("💾 Saved preferences")

        time.sleep(2)
        body = driver.page_source
        for sub in add_subs:
            if f"r/{sub}" in body:
                print(f"✅ r/{sub} visible on dashboard")
            else:
                print(f"❌ r/{sub} not found on dashboard")
        for sub in delete_subs:
            if f"r/{sub}" not in body:
                print(f"✅ r/{sub} successfully removed")
            else:
                print(f"❌ r/{sub} still appears on dashboard")

    except Exception as e:
        print(f"❌ Test for {username} failed: {e}")
    finally:
        time.sleep(2)
        driver.quit()

# Run tests for 4 different users
run_user_test(add_subs=["gadgets", "ai"])
run_user_test(add_subs=["webdev", "science"])
run_user_test(add_subs=["reactjs"], delete_subs=["reactjs"])  # Add then delete
run_user_test(add_subs=["technology"], delete_subs=["nonexistentsubreddit"])  # Try to delete something not added
