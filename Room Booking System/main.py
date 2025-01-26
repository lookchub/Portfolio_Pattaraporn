import pandas as pd
from datetime import datetime

# Load booked rooms data
booked_df = pd.DataFrame(columns=['Room', 'StudentID', 'Date'])

try:
    booked_df = pd.read_csv('bookedroom.csv', header=None, names=['Room', 'StudentID', 'Date'])
except FileNotFoundError:
    pass

# Load student data
students_df = pd.read_csv('students.csv')

listlab = ['LAB103', 'LAB104', 'LAB105', 'LAB106']
listlecture = ['IT301', 'IT302', 'IT303', 'IT304']

# Function 1: Display list of students
def name():
    print("\nList of students:")
    print(students_df)
    print()
    interface()

# Function 2: Submit a booking request
def requestbook():
    print()
    global booked_df
    student_id = input('ID: ')
    while student_id not in students_df['id'].astype(str).values:
        student_id = input('ID is not found. Please try again: ')

    room_type = input('Room types (Lecture/Lab): ').lower()
    room_list = listlecture if room_type == 'lecture' else listlab if room_type == 'lab' else []

    while not room_list:
        room_type = input('Invalid room type. Please enter Lecture or Lab: ').lower()
        room_list = listlecture if room_type == 'lecture' else listlab

    print(room_list)
    room_book = input('Please select one room above: ').upper()
    while room_book not in room_list:
        room_book = input('Invalid room. Please select one room above: ').upper()

    book_date = input('Booking date (DD/MM/YYYY): ')
    while True:
        try:
            datetime.strptime(book_date, "%d/%m/%Y")
            break
        except ValueError:
            book_date = input('Incorrect format. Booking date (DD/MM/YYYY): ')

    if not booked_df[(booked_df['Room'] == room_book) & (booked_df['Date'] == book_date)].empty:
        print(f'{room_book} is not available on {book_date}')
    else:
        new_booking = pd.DataFrame({'Room': [room_book], 'StudentID': [student_id], 'Date': [book_date]})
        booked_df = pd.concat([booked_df, new_booking], ignore_index=True)
        booked_df.to_csv('bookedroom.csv', index=False, header=False)
        print('Booking successful!')

    print()
    interface()

# Function 3: Check bookings for a specific room
def checkroom():
    print()
    global booked_df
    room_num = input('Room number: ').upper()
    while room_num not in listlab + listlecture:
        room_num = input("This room doesn't exist in the system. Please try again: ").upper()

    room_bookings = booked_df[booked_df['Room'] == room_num]
    if room_bookings.empty:
        print('No bookings for this room.')
    else:
        print('Current bookings:')
        print(room_bookings[['Date', 'StudentID']])
    print()
    interface()

# Function 4: Check available rooms for a specific date
def availableroom():
    print()
    global booked_df
    check_date = input('Checking date (DD/MM/YYYY): ')
    while True:
        try:
            datetime.strptime(check_date, "%d/%m/%Y")
            break
        except ValueError:
            check_date = input('Incorrect format. Checking date (DD/MM/YYYY): ')

    unavailable_rooms = booked_df[booked_df['Date'] == check_date]['Room'].tolist()
    available_labs = [room for room in listlab if room not in unavailable_rooms]
    available_lectures = [room for room in listlecture if room not in unavailable_rooms]

    print(f'Available Labs: {available_labs}')
    print(f'Available Lecture Rooms: {available_lectures}')
    print()
    interface()

# Function 5: Check bookings by student ID
def checkwithid():
    print()
    global booked_df
    student_id = input('ID: ')
    while student_id not in students_df['id'].astype(str).values:
        student_id = input('ID is not found. Please try again: ')

    student_bookings = booked_df[booked_df['StudentID'] == student_id]
    if student_bookings.empty:
        print('No bookings for this student.')
    else:
        print('Bookings:')
        print(student_bookings[['Room', 'Date']])
    print()
    interface()

# Function 6: Check bookings by student first name
def checkwithname():
    print()
    global booked_df
    first_name = input('First name: ')
    matched_students = students_df[students_df['fname'].str.contains(first_name, case=False, na=False)]

    if matched_students.empty:
        print('No students found with that name.')
    else:
        for _, student in matched_students.iterrows():
            print(f"{student['id']} {student['fname']} {student['lname']}")
            student_bookings = booked_df[booked_df['StudentID'] == str(student['id'])]
            if student_bookings.empty:
                print('No bookings for this student.')
            else:
                print(student_bookings[['Room', 'Date']])
    print()
    interface()

# Function 7: Print booking summary
def readbook():
    print()
    global booked_df
    print('Lecture Rooms:')
    for room in listlecture:
        print(room)
        room_bookings = booked_df[booked_df['Room'] == room]
        if room_bookings.empty:
            print('No bookings')
        else:
            print(room_bookings[['Date', 'StudentID']])
    print()

    print('Lab Rooms:')
    for room in listlab:
        print(room)
        room_bookings = booked_df[booked_df['Room'] == room]
        if room_bookings.empty:
            print('No bookings')
        else:
            print(room_bookings[['Date', 'StudentID']])
    print()
    interface()

# Main menu
def interface():
    print('MUICT Student Room Booking System')
    print('1. Print a list of students')
    print('2. Submit a booking request')
    print('3. Check the current booking via room number')
    print('4. Check available rooms via date')
    print('5. Check bookings by student ID')
    print('6. Check bookings by student first name')
    print('7. Print booking summary')
    print('0. Exit')

    option = input('Option: ')
    while option not in map(str, range(8)):
        option = input('Invalid option. Please try again: ')

    option = int(option)
    if option == 1:
        name()
    elif option == 2:
        requestbook()
    elif option == 3:
        checkroom()
    elif option == 4:
        availableroom()
    elif option == 5:
        checkwithid()
    elif option == 6:
        checkwithname()
    elif option == 7:
        readbook()
    elif option == 0:
        print('Exiting the system. Goodbye!')

interface()
