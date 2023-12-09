import story

from functions import (
    get_airports,
    start_airport,
    get_goals,
    create_game,
    get_airport_info,
    check_goal,
    update_location,
    calculate_distance,
    airports_in_range
)

# game starts
# ask to show the story
print('Welcome to play : NATIONAL TREASURE')
while True:
    print('\n')
    print('      MENU ')
    print('     1.Start ')
    print('     2.Story ')
    print('      Exit(E)')
    choice = input('Please choose: ')

    if choice == '2':
        for line in story.get_story():
            print(line, end='')
    elif choice == 'E':
        print('See You!')
        break
    elif choice == '1':

        # GAME SETTINGS
        print('When you are ready to start, ')
        player = input('type player name: ')
        # boolean for game over and win
        game_over = False
        win = False

        # start money = 1000
        money = 1000
        # start range in km = 2000
        player_range = 2000


        # all airports
        all_airports = get_airports()
        # start_airport ident
        startgame = start_airport()
        start_airport = startgame[0]['ident']

        # current airport
        current_airport = start_airport

        # game id
        game_id = create_game(money, player_range, start_airport, player, all_airports)
        print(f'Please remember this ICAO: {start_airport}')
        # GAME LOOP
        while not game_over:
            # get current airport info
            airport = get_airport_info(current_airport)
            # show game status
            print(f'''You are at {airport['name']}.''')
            print(f'''You have {money:.0f}EURO and {player_range:.0f}km of range.''')
            # pause
            input('\033[32mPress Enter to continue...\033[0m')
            # if airport has goal ask if player wants to open it
            # check goal type and add/subtract money accordingly
            goal = check_goal(game_id, current_airport)
            if goal:
                question = input(
                    f'''Do you want to open secret box for {"100e or " if money > 100 else ""}{"50km range" if player_range > 50 else ""}? M = money, R = range, enter to skip: ''')
                if not question == '':
                    if question == 'M':
                        money -= 100
                    elif question == 'R':
                        player_range -= 50
                    if goal['money'] > 0:
                        money += goal['money']
                        print(f''' {goal['name']}. That is worth {goal['money']}EURO.''')
                        print(f'''You have now {money:.0f}EURO''')
                    elif goal['money'] == 0:
                        win = True
                        print(f'''Congratulations! You found the the Mona Lisa. Now go to start.''')
                        print(f'''You get 6000km in range from Interpol''')
                        player_range += 6000
                        input('\033[32mPress Enter to continue...\033[0m')
                    else:
                        money = money / 2
                        print(f'''Oh no! You have been hacked. You lost half your money''')
                        input('\033[32mPress Enter to continue...\033[0m')

            # ask to buy fuel/range
            if money > 0 and win == False:
                question2 = input('Do you want to buy fuel? 1e = 2km of range. Enter amount or press enter:')
                if not question2 == '':
                    question2 = float(question2)
                    if question2 > money:
                        print(f'''You don't have enough money.''')
                    else:
                        player_range += question2 * 2
                        money -= question2
                        print(f'''You have now {money:.0f}EURO and {player_range:.0f}km of range''')
                # pause
                input("\033[32mPress Enter to continue...\033[0m")

            # if no range, game over
            # show airports in range. if none, game over
            airports = airports_in_range(current_airport, all_airports, player_range)
            print(f'''\033[34mThere are {len(airports)} airports in range: \033[0m''')
            if len(airports) == 0:
                print('You are out of range.')
                game_over = True
            else:
                print(f'''Airports: ''')
                for airport in airports:
                    ap_distance = calculate_distance(current_airport, airport['ident'])
                    print(f'''{airport['name']}, icao: {airport['ident']}, distance: {ap_distance:.0f}km''')
                # ask for destination
                dest = input('Enter destination icao: ')
                selected_distance = calculate_distance(current_airport, dest)
                player_range -= selected_distance
                update_location(dest, player_range, money, game_id)
                current_airport = dest
                if player_range < 0:
                    game_over = True
            # if diamond is found and player is at start, game is won
            if win and current_airport == start_airport:
                print(f'''You won! You have {money}EURO and {player_range}km of range left.''')
                game_over = True

        print(f'''{'You won!' if win else 'You lost!'}''')
        print(f'''You have {money:.0f}EURO''')
        print(f'''Your range is {player_range:.0f}km''')
        break