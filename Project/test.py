from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time

driver = webdriver.Chrome()
driver.get("http://127.0.0.1:8090")

loginName = driver.find_element_by_name("uname")
password = driver.find_element_by_name("psw")
button = driver.find_element_by_id("login")

driver.find_element_by_id("uname").send_keys("niklas")
driver.find_element_by_id("password").send_keys("1234")
driver.find_element_by_id("name").send_keys("Niklas")
driver.find_element_by_id("bday").send_keys("16101994")
driver.find_element_by_id("gender").send_keys("male")
driver.find_element_by_id("job").send_keys("programmer")
driver.find_element_by_id("register").click()
time.sleep(0.5)
assert ("Sweet!" in driver.page_source or "exist" in driver.page_source)

loginName.send_keys("niklas")
password.send_keys("1234")
button.click()
time.sleep(0.5)
assert "LogOut" in driver.page_source

driver.find_element_by_id("logout").click()

loginName = driver.find_element_by_name("uname")
password = driver.find_element_by_name("psw")
button = driver.find_element_by_id("login")

driver.find_element_by_id("uname").send_keys("kalle")
driver.find_element_by_id("password").send_keys("1234")
driver.find_element_by_id("name").send_keys("Karl")
driver.find_element_by_id("bday").send_keys("09071969")
driver.find_element_by_id("gender").send_keys("male")
driver.find_element_by_id("job").send_keys("duck")
driver.find_element_by_id("register").click()
time.sleep(1)
assert ("Sweet!" in driver.page_source or "exist" in driver.page_source)

loginName.send_keys("kalle")
password.send_keys("1234")
button.click()
time.sleep(0.5)
assert "LogOut" in driver.page_source

driver.find_element_by_id("search").click()
driver.find_element_by_id("searchbar").send_keys("niklas")
time.sleep(0.5)
driver.find_element_by_id("niklas").click()
time.sleep(0.5)
butt = driver.find_element_by_tag_name('button')
butt.click()
driver.find_element_by_id("logout").click()

loginName = driver.find_element_by_name("uname")
password = driver.find_element_by_name("psw")
button = driver.find_element_by_id("login")

loginName.send_keys("niklas")
password.send_keys("1234")
button.click()
time.sleep(0.5)
assert "LogOut" in driver.page_source

driver.find_element_by_id("friends").click()
time.sleep(0.5)
driver.find_element_by_id("accept_kalle").click()
assert "kalle" in driver.page_source
time.sleep(0.5)
driver.find_element_by_id("kalle").click()

driver.find_element_by_id("msgbx").send_keys("hello world")
driver.find_element_by_id("send").click()
time.sleep(0.5)
assert "hello world" in driver.page_source

driver.find_element_by_id("logout").click()

loginName = driver.find_element_by_name("uname")
password = driver.find_element_by_name("psw")
button = driver.find_element_by_id("login")

loginName.send_keys("kalle")
password.send_keys("1234")
button.click()
time.sleep(0.5)
assert "LogOut" in driver.page_source
assert "hello world" in driver.page_source






# logout and close
logout = driver.find_element_by_id("logout")
logout.click()
print("Test passed!")
driver.close()
