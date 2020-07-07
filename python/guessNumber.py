import random

class GuessNumber:
    def __init__(self, n):
        self.numbers = self.genAllNumbers(n)
        self.round = 0;
        self.previousGuess = None

    # Compare guess and answer to see if they are similar.
    def checkSimilarity(self, guess, answer, hint):
        return hint == self.getHint(guess, answer)

    # Compare `guess` and `answer` and return "XAXB" hint.
    def getHint(self, guess, answer):

        # initialize
        countOfA, countOfB = 0, 0
        ASet = set()

        for i in range(len(answer)):
            if answer[i] == guess[i]:
                countOfA += 1
                ASet.add(answer[i])
        
        for i in range(len(guess)):
            if guess[i] not in ASet and guess[i] in answer:
                countOfB += 1

        return str(countOfA) + "A" + str(countOfB) + "B"

    def guess(self):
        if self.round == 0:
            self.previousGuess = random.choice(self.numbers)
            self.round += 1
            return self.previousGuess

        self.previousGuess = random.choice(self.numbers)
        self.round += 1
        return self.previousGuess

    def eliminate(self, hint):

        # initialize
        updatedNumbers = []

        for num in self.numbers:
            if self.checkSimilarity(self.previousGuess, num, hint):
                updatedNumbers.append(num)
        
        # print("# of deletion:", len(self.numbers) - len(updatedNumbers))
        self.numbers = updatedNumbers
        return None

    def genAllNumbers(self, n):

        # initialize
        numbers = []

        for i in range(0, 10 ** n):
            candidate = str(i)
            while len(candidate) < n:
                candidate = "0" + candidate
            if len(set(candidate)) == n: # only allow distint numbers
                numbers.append(candidate)
        return numbers

class HintMachine:
    
    def __init__(self, answer):
        self.answer = answer

    # @param guess: str
    # @return str (XAXB)
    def getHint(self, guess):

        # initialize
        countOfA, countOfB = 0, 0
        ASet = set()

        for i in range(len(self.answer)):
            if self.answer[i] == guess[i]:
                countOfA += 1
                ASet.add(self.answer[i])
        
        for i in range(len(guess)):
            if guess[i] not in ASet and guess[i] in self.answer:
                countOfB += 1

        return str(countOfA) + "A" + str(countOfB) + "B"

if __name__ == '__main__':
    hm = HintMachine("5049")
    # print(hm.getHint("1234")) # 0A1B
    # print(hm.getHint("4589")) # 4A0B
    # print(hm.getHint("4567")) # 2A0B
    # print(hm.getHint("9854")) # 0A4B

    gn = GuessNumber(4);
    # print(gn.getHint("1234", "4321"))
    # print(gn.checkSimilarity("1234", "3241", "1A3B"))
    # print(gn.guess())

    while len(gn.numbers) > 1:
        guess = gn.guess()
        print("Guess: " + guess)
        # hint = input("Hint (XAXB): ")
        hint = hm.getHint(guess)
        gn.eliminate(hint)

    print(gn.round)
    print("Answer: ", gn.numbers)

    # while True:
    #     guess = input("Guess: ")
    #     print(hm.getHint(guess))
